"""Unit Tests for JWT and Cookie Helpers (services/auth/jwt.py)

Tests token generation, expiration timing, cryptographic signature validation,
tamper detection, and httpOnly cookie attributes.
"""

from datetime import datetime, timedelta, timezone

import jwt
from auth.jwt import decode_jwt_token, delete_auth_cookie, generate_jwt_token, set_auth_cookie
from django.conf import settings
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.test import TestCase
from rest_framework.exceptions import AuthenticationFailed


class JWTUnitTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="jwt_tester",
            email="jwt_tester@example.com",
            password="TestPassword123!",
        )

    def test_jwt_token_generation_claims_and_7_day_lifetime(self):
        token = generate_jwt_token(self.user)
        self.assertIsInstance(token, str)

        payload = decode_jwt_token(token)
        self.assertEqual(payload["user_id"], self.user.id)
        self.assertEqual(payload["username"], "jwt_tester")
        self.assertEqual(payload["email"], "jwt_tester@example.com")

        # Verify 7-day expiration lifetime: 7 * 24 * 60 * 60 = 604,800 seconds
        expected_lifespan = 7 * 24 * 60 * 60
        actual_lifespan = payload["exp"] - payload["iat"]
        self.assertEqual(actual_lifespan, expected_lifespan)

    def test_tampered_token_is_rejected(self):
        token = generate_jwt_token(self.user)
        # Tamper with the token payload
        parts = token.split(".")
        tampered_token = f"{parts[0]}.eyAidXNlcl9pZCI6IDk5OTkgfQ.{parts[2]}"

        with self.assertRaises(AuthenticationFailed):
            decode_jwt_token(tampered_token)

    def test_expired_token_is_rejected(self):
        # Manually create an expired token
        past_time = datetime.now(timezone.utc) - timedelta(days=8)
        expired_payload = {
            "user_id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "iat": int((past_time - timedelta(minutes=1)).timestamp()),
            "exp": int(past_time.timestamp()),
        }
        expired_token = jwt.encode(
            expired_payload,
            settings.JWT_SECRET_KEY,
            algorithm=settings.JWT_ALGORITHM,
        )

        with self.assertRaises(AuthenticationFailed) as ctx:
            decode_jwt_token(expired_token)
        self.assertIn("Token has expired", str(ctx.exception))

    def test_set_auth_cookie_attributes(self):
        response = HttpResponse("ok")
        token = generate_jwt_token(self.user)
        set_auth_cookie(response, token)

        cookie_name = getattr(settings, "AUTH_COOKIE_NAME", "access_token")
        self.assertIn(cookie_name, response.cookies)

        cookie = response.cookies[cookie_name]
        self.assertEqual(cookie.value, token)
        self.assertTrue(cookie["httponly"], "Cookie MUST be httpOnly to prevent XSS access.")
        self.assertEqual(cookie["max-age"], 7 * 24 * 60 * 60, "Cookie max-age MUST be exactly 7 days.")
        self.assertEqual(cookie["samesite"], "Lax")
        self.assertEqual(cookie["path"], "/")

    def test_delete_auth_cookie(self):
        response = HttpResponse("ok")
        token = generate_jwt_token(self.user)
        set_auth_cookie(response, token)

        # Now delete
        delete_auth_cookie(response)
        cookie_name = getattr(settings, "AUTH_COOKIE_NAME", "access_token")
        cookie = response.cookies[cookie_name]
        self.assertTrue(cookie.value == "" or cookie["max-age"] == 0)
