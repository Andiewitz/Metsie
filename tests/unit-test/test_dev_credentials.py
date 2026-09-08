"""Tests for Dummy Dev Credentials

Verifies:
- In development environment: dev credentials automatically authenticate and issue 7-day httpOnly cookie.
- In production environment: dev credentials return 403 Forbidden with zero cookie issuance.
- Wrong dev password in development returns 400 Bad Request.
"""

from auth.jwt import decode_jwt_token
from django.conf import settings
from django.contrib.auth.models import User
from django.test import TestCase, override_settings
from rest_framework import status
from rest_framework.test import APIClient


class DevCredentialsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.login_url = "/api/auth/login/"
        self.dev_user = "dev"
        self.dev_email = "dev@metsie.local"
        self.dev_password = "devpassword123"

    @override_settings(ENVIRONMENT="development", DEBUG=True)
    def test_dev_login_success_by_username_in_development(self):
        """In development mode, username 'dev' logs in and receives a 7-day cookie."""
        res = self.client.post(
            self.login_url,
            {"username_or_email": self.dev_user, "password": self.dev_password},
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn(settings.AUTH_COOKIE_NAME, res.cookies)
        cookie = res.cookies[settings.AUTH_COOKIE_NAME]
        self.assertTrue(cookie["httponly"])
        self.assertEqual(cookie["samesite"], "Lax")

        # Verify user auto-provisioning
        user = User.objects.get(username=self.dev_user)
        self.assertEqual(user.email, self.dev_email)
        self.assertTrue(user.profile.is_onboarded)

        # Cryptographic JWT validation
        payload = decode_jwt_token(cookie.value)
        self.assertEqual(payload["username"], self.dev_user)

    @override_settings(ENVIRONMENT="development", DEBUG=True)
    def test_dev_login_success_by_email_in_development(self):
        """In development mode, email 'dev@metsie.local' logs in and receives cookie."""
        res = self.client.post(
            self.login_url,
            {"username_or_email": self.dev_email, "password": self.dev_password},
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn(settings.AUTH_COOKIE_NAME, res.cookies)

    @override_settings(ENVIRONMENT="production", DEBUG=False)
    def test_dev_login_forbidden_in_production(self):
        """In production mode, attempting to use dev credentials MUST return 403 Forbidden."""
        res = self.client.post(
            self.login_url,
            {"username_or_email": self.dev_user, "password": self.dev_password},
        )
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(res.data.get("detail"), "Development credentials are forbidden in production.")
        self.assertNotIn(settings.AUTH_COOKIE_NAME, res.cookies)

    @override_settings(ENVIRONMENT="production", DEBUG=False)
    def test_dev_login_by_email_forbidden_in_production(self):
        """In production mode, email dev credentials also MUST return 403 Forbidden."""
        res = self.client.post(
            self.login_url,
            {"username_or_email": self.dev_email, "password": self.dev_password},
        )
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(res.data.get("detail"), "Development credentials are forbidden in production.")
        self.assertNotIn(settings.AUTH_COOKIE_NAME, res.cookies)

    @override_settings(ENVIRONMENT="development", DEBUG=True)
    def test_dev_login_wrong_password_in_development(self):
        """In development mode, invalid dev password returns 400 Bad Request."""
        res = self.client.post(
            self.login_url,
            {"username_or_email": self.dev_user, "password": "wrongpassword!"},
        )
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertNotIn(settings.AUTH_COOKIE_NAME, res.cookies)
