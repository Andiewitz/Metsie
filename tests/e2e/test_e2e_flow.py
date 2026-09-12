"""End-to-End Integration Flow Tests

Tests the complete lifecycle of a user across the entire authentication system:
Registration -> Cookie Attachment -> Session Verification -> Account Setup -> Logout -> Relogin.
"""

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient


class AuthenticationE2EFlowTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = "/api/auth/register/"
        self.login_url = "/api/auth/login/"
        self.logout_url = "/api/auth/logout/"
        self.me_url = "/api/auth/me/"
        self.account_setup_url = "/api/auth/account-setup/"

    def test_complete_user_lifecycle(self):
        # 1. Register a new user
        reg_res = self.client.post(
            self.register_url,
            {
                "username": "e2e_tester",
                "email": "e2e_tester@example.com",
                "password": "ComplexPassword!2026",
                "password_confirm": "ComplexPassword!2026",
            },
            format="json",
        )
        self.assertEqual(reg_res.status_code, status.HTTP_201_CREATED)
        self.assertIn("access_token", reg_res.cookies)
        self.assertTrue(reg_res.cookies["access_token"]["httponly"])
        self.assertEqual(reg_res.cookies["access_token"]["max-age"], 604800)

        # 2. Check session hydration via /me (browser sends cookie automatically)
        me_res = self.client.get(self.me_url)
        self.assertEqual(me_res.status_code, status.HTTP_200_OK)
        user_data = me_res.json()["user"]
        self.assertEqual(user_data["username"], "e2e_tester")
        self.assertFalse(user_data["profile"]["is_onboarded"])

        # 3. Complete onboarding via dedicated account-setup endpoint
        setup_res = self.client.post(
            self.account_setup_url,
            {
                "full_name": "E2E Lifecycle Tester",
                "role": "Automation Specialist",
                "bio": "Verifying complete decoupled authentication flow.",
            },
            format="json",
        )
        self.assertEqual(setup_res.status_code, status.HTTP_200_OK)
        updated_profile = setup_res.json()["user"]["profile"]
        self.assertTrue(updated_profile["is_onboarded"])
        self.assertEqual(updated_profile["full_name"], "E2E Lifecycle Tester")

        # 4. Logout
        logout_res = self.client.post(self.logout_url)
        self.assertEqual(logout_res.status_code, status.HTTP_200_OK)

        # 5. Clear client cookies to simulate browser wipe and verify protection
        self.client.cookies.clear()
        unauth_me = self.client.get(self.me_url)
        self.assertEqual(unauth_me.status_code, status.HTTP_401_UNAUTHORIZED)

        # 6. Re-login with email
        relogin_res = self.client.post(
            self.login_url,
            {
                "username_or_email": "e2e_tester@example.com",
                "password": "ComplexPassword!2026",
            },
            format="json",
        )
        self.assertEqual(relogin_res.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", relogin_res.cookies)
        self.assertTrue(relogin_res.cookies["access_token"]["httponly"])
        self.assertEqual(relogin_res.cookies["access_token"]["max-age"], 604800)

        # 7. Verify session is restored with existing onboarding data
        restored_me = self.client.get(self.me_url)
        self.assertEqual(restored_me.status_code, status.HTTP_200_OK)
        self.assertTrue(restored_me.json()["user"]["profile"]["is_onboarded"])
        self.assertEqual(restored_me.json()["user"]["profile"]["role"], "Automation Specialist")
