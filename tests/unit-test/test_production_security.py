"""Production Security Tests

Verifies:
- Authentication requires real registered users — no backdoor bypasses.
- Incorrect credentials return 400 Bad Request.
- No session cookie is set on failed authentication.
- Cookie security attributes are correctly configured.
"""

from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient


class ProductionSecurityTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.login_url = "/api/auth/login/"

        # Create a legitimate test user
        self.user = User.objects.create_user(
            username="testplayer",
            email="testplayer@metsie.com",
            password="SecurePass2026!",
            is_active=True,
        )

    def test_login_with_correct_credentials_succeeds(self):
        """Correct username + password returns 200 and sets httpOnly cookie."""
        res = self.client.post(
            self.login_url,
            {"username_or_email": "testplayer", "password": "SecurePass2026!"},
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", res.cookies)
        cookie = res.cookies["access_token"]
        self.assertTrue(cookie["httponly"])
        self.assertEqual(cookie["samesite"], "Lax")

    def test_login_with_wrong_password_returns_400(self):
        """Wrong password must return 400 Bad Request with no cookie."""
        res = self.client.post(
            self.login_url,
            {"username_or_email": "testplayer", "password": "WrongPassword"},
        )
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertNotIn("access_token", res.cookies)

    def test_login_with_nonexistent_user_returns_400(self):
        """Non-existent user returns 400 Bad Request with no cookie."""
        res = self.client.post(
            self.login_url,
            {"username_or_email": "ghost_user", "password": "SomePassword123"},
        )
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertNotIn("access_token", res.cookies)

    def test_old_dev_credentials_no_longer_bypass_auth(self):
        """Former dev backdoor credentials (dev / devpassword123) do not grant access."""
        res = self.client.post(
            self.login_url,
            {"username_or_email": "dev", "password": "devpassword123"},
        )
        # Should fail — no user named 'dev' exists in a clean production DB
        self.assertNotEqual(res.status_code, status.HTTP_200_OK)
        self.assertNotIn("access_token", res.cookies)

    def test_old_dev_email_no_longer_bypass_auth(self):
        """Former dev email (dev@metsie.local) does not grant access."""
        res = self.client.post(
            self.login_url,
            {"username_or_email": "dev@metsie.local", "password": "devpassword123"},
        )
        self.assertNotEqual(res.status_code, status.HTTP_200_OK)
        self.assertNotIn("access_token", res.cookies)

    def test_login_with_email_succeeds(self):
        """Login using email address also works correctly."""
        res = self.client.post(
            self.login_url,
            {"username_or_email": "testplayer@metsie.com", "password": "SecurePass2026!"},
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", res.cookies)

    def test_login_with_inactive_user_returns_400(self):
        """Inactive user account cannot authenticate."""
        User.objects.create_user(
            username="inactiveuser",
            email="inactive@metsie.com",
            password="SomePass456!",
            is_active=False,
        )
        res = self.client.post(
            self.login_url,
            {"username_or_email": "inactiveuser", "password": "SomePass456!"},
        )
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertNotIn("access_token", res.cookies)
