"""DRF Authentication Backend for HttpOnly Cookies

Pulls the JWT from request.COOKIES, decodes it, and authenticates the user.
Falls back to Authorization header (Bearer <token>) if cookies are absent.
Gracefully returns None on invalid/expired tokens so stale cookies do not
block login or registration.
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

        # Fallback to Authorization: Bearer <token> for external API clients
        if not token:
            auth_header = request.headers.get("Authorization", "")
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ", 1)[1].strip()

        if not token:
            return None  # Unauthenticated, let DRF permission classes decide

        try:
            payload = decode_jwt_token(token)
        except AuthenticationFailed:
            # If the token is invalid, expired, or signed with an old secret key,
            # treat the user as unauthenticated (None) rather than halting the request.
            # This allows LoginView and RegisterView to proceed and issue a fresh cookie,
            # while IsAuthenticated permission classes will still correctly reject protected endpoints.
            return None

        user_id = payload.get("user_id")
        if not user_id:
            return None

        try:
            user = User.objects.get(id=user_id, is_active=True)
        except User.DoesNotExist:
            return None

        return (user, token)

    def authenticate_header(self, request):
        return 'Bearer realm="api"'
