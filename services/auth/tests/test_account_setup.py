"""Tests for Dedicated Account Setup Service (services/auth/account_setup.py)

Tests post-registration onboarding logic and profile persistence.
"""

from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from auth.jwt import generate_jwt_token


class AccountSetupTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.account_setup_url = "/api/auth/account-setup/"

        self.user = User.objects.create_user(
            username="onboarding_user",
            email="onboarding@example.com",
            password="TestPassword123!",
        )

    def test_anonymous_access_denied(self):
        """Unauthenticated requests to account-setup must return 401."""
        response = self.client.get(self.account_setup_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        post_res = self.client.post(self.account_setup_url, {"full_name": "Hacker"})
        self.assertEqual(post_res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_and_post_account_setup(self):
        """Authenticated user can inspect and submit their profile onboarding."""
        token = generate_jwt_token(self.user)
        # Attach cookie to test client
        self.client.cookies["access_token"] = token

        # Initial state
        get_res = self.client.get(self.account_setup_url)
        self.assertEqual(get_res.status_code, status.HTTP_200_OK)
        self.assertFalse(get_res.json()["is_onboarded"])

        # Submit onboarding info
        payload = {
            "full_name": "Ada Lovelace",
            "company": "Analytical Engine Corp",
            "role": "Chief Mathematician",
            "bio": "Pioneering computer algorithms since 1843.",
        }
        post_res = self.client.post(self.account_setup_url, payload, format="json")
        self.assertEqual(post_res.status_code, status.HTTP_200_OK)

        data = post_res.json()
        self.assertEqual(data["message"], "Account setup completed successfully.")
        self.assertTrue(data["user"]["profile"]["is_onboarded"])
        self.assertEqual(data["user"]["profile"]["full_name"], "Ada Lovelace")
        self.assertEqual(data["user"]["profile"]["company"], "Analytical Engine Corp")

        # Verify database reflection
        self.user.refresh_from_db()
        self.assertEqual(self.user.profile.full_name, "Ada Lovelace")
        self.assertTrue(self.user.profile.is_onboarded)
