"""DRF Authentication Backend for HttpOnly Cookies

Pulls the JWT from request.COOKIES, decodes it, and authenticates the user.
Falls back to Authorization header (Bearer <token>) if cookies are absent.
"""

from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from .jwt import decode_jwt_token


class CookieJWTAuthentication(BaseAuthentication):
    """Custom DRF authentication scheme extracting JWTs from httpOnly cookies."""

    def authenticate(self, request):
        cookie_name = getattr(settings, "AUTH_COOKIE_NAME", "access_token")
        token = request.COOKIES.get(cookie_name)

        # Fallback to Authorization: Bearer <token> for development or external API clients
        if not token:
            auth_header = request.headers.get("Authorization", "")
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ", 1)[1].strip()

        if not token:
            return None  # Unauthenticated, let DRF permission classes decide

        payload = decode_jwt_token(token)

        user_id = payload.get("user_id")
        if not user_id:
            raise AuthenticationFailed("Invalid token payload: missing user identification.")

        try:
            user = User.objects.get(id=user_id, is_active=True)
        except User.DoesNotExist:
            raise AuthenticationFailed("User matching this token does not exist or is inactive.")

        return (user, token)

    def authenticate_header(self, request):
        return 'Bearer realm="api"'
