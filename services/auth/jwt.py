"""JWT Service Module

Handles JWT encoding, decoding, token validation, and httpOnly cookie management.
Ensures tokens expire in 7 days and are securely handled via cookies rather than localStorage.
"""

from datetime import datetime, timedelta, timezone

import jwt
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed


def generate_jwt_token(user) -> str:
    """Generate a signed JWT token for a given user with a 7-day expiration."""
    now = datetime.now(timezone.utc)
    expiration = now + timedelta(days=getattr(settings, "JWT_EXPIRATION_DAYS", 7))

    payload = {
        "user_id": user.id,
        "username": user.username,
        "email": user.email,
        "iat": int(now.timestamp()),
        "exp": int(expiration.timestamp()),
    }

    token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=getattr(settings, "JWT_ALGORITHM", "HS256"))
    return token


def decode_jwt_token(token: str) -> dict:
    """Decode and validate a signed JWT token.

    Raises AuthenticationFailed if expired or invalid.
    """
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[getattr(settings, "JWT_ALGORITHM", "HS256")])
        return payload
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Token has expired. Please log in again.")
    except jwt.InvalidTokenError:
        raise AuthenticationFailed("Invalid token. Please authenticate.")


def set_auth_cookie(response, token: str) -> None:
    """Attach the JWT token as an httpOnly cookie with a 7-day lifetime.

    HttpOnly prevents JavaScript access (mitigating XSS theft).
    SameSite=Lax prevents CSRF on cross-site requests.
    """
    max_age = getattr(settings, "AUTH_COOKIE_MAX_AGE", 7 * 24 * 60 * 60)
    secure = getattr(settings, "AUTH_COOKIE_SECURE", False)
    samesite = getattr(settings, "AUTH_COOKIE_SAMESITE", "Lax")
    cookie_name = getattr(settings, "AUTH_COOKIE_NAME", "access_token")
    cookie_path = getattr(settings, "AUTH_COOKIE_PATH", "/")

    response.set_cookie(
        key=cookie_name,
        value=token,
        max_age=max_age,
        httponly=True,
        secure=secure,
        samesite=samesite,
        path=cookie_path,
    )


def delete_auth_cookie(response) -> None:
    """Clear the authentication cookie upon logout."""
    cookie_name = getattr(settings, "AUTH_COOKIE_NAME", "access_token")
    cookie_path = getattr(settings, "AUTH_COOKIE_PATH", "/")
    samesite = getattr(settings, "AUTH_COOKIE_SAMESITE", "Lax")

    response.delete_cookie(
        key=cookie_name,
        path=cookie_path,
        samesite=samesite,
    )
