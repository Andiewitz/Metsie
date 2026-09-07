"""Tests for User Login, JWT Generation, and 7-Day HttpOnly Cookies

Explicitly tests:
- Successful login using username or email
- Proper 7-day httpOnly, SameSite=Lax cookie attachment
- Cryptographic validity of the issued JWT
- Security check: JWT is not exposed in the response body
- Subsequent authenticated requests using the cookie
- Failure cases: invalid password, unknown user, inactive user
"""

from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from auth.jwt import decode_jwt_token


class LoginAuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.login_url = "/api/auth/login/"
        self.logout_url = "/api/auth/logout/"
        self.me_url = "/api/auth/me/"

        self.username = "sarah_connor"
        self.email = "sarah@resistance.org"
        self.password = "SkynetMustFall2026!"

        self.user = User.objects.create_user(
            username=self.username,
            email=self.email,
            password=self.password,
        )

    def test_login_with_username_success(self):
        """Verifies login with username returns 200 OK and sets a 7-day httpOnly JWT cookie."""
        payload = {
            "username_or_email": self.username,
            "password": self.password,
        }
        response = self.client.post(self.login_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data["message"], "Login successful.")
        self.assertEqual(data["user"]["username"], self.username)
        self.assertEqual(data["user"]["email"], self.email)

        # 1. Verify token is NOT exposed in response body (protects against localStorage caching)
        self.assertNotIn("token", data)
        self.assertNotIn("access_token", data)
        self.assertNotIn("jwt", data)

        # 2. Verify Cookie attributes
        self.assertIn("access_token", response.cookies, "Response must attach 'access_token' cookie.")
        cookie = response.cookies["access_token"]

        self.assertTrue(cookie["httponly"], "access_token cookie MUST have httpOnly=True.")
        self.assertEqual(cookie["max-age"], 7 * 24 * 60 * 60, "Cookie max-age MUST be 604,800 seconds (7 days).")
        self.assertEqual(cookie["samesite"], "Lax", "Cookie sameSite MUST be Lax.")
        self.assertEqual(cookie["path"], "/", "Cookie path MUST be '/'.")

        # 3. Verify JWT Cryptographic Payload
        token = cookie.value
        decoded = decode_jwt_token(token)
        self.assertEqual(decoded["user_id"], self.user.id)
        self.assertEqual(decoded["username"], self.username)
        self.assertEqual(decoded["email"], self.email)
        self.assertEqual(decoded["exp"] - decoded["iat"], 7 * 24 * 60 * 60)

    def test_login_with_email_success(self):
        """Verifies login using email (case-insensitive) succeeds and sets cookie."""
        payload = {
            "username_or_email": "SARAH@resistance.org",
            "password": self.password,
        }
        response = self.client.post(self.login_url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", response.cookies)
        cookie = response.cookies["access_token"]
        self.assertTrue(cookie["httponly"])
        self.assertEqual(cookie["max-age"], 604800)

    def test_subsequent_authenticated_request_using_login_cookie(self):
        """Verifies that the cookie issued during login authenticates protected endpoints."""
        # Step 1: Login
        login_res = self.client.post(
            self.login_url,
            {
                "username_or_email": self.username,
                "password": self.password,
            },
            format="json",
        )
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)

        # Step 2: Access protected /me/ endpoint (client automatically sends cookie)
        me_res = self.client.get(self.me_url)
        self.assertEqual(me_res.status_code, status.HTTP_200_OK)
        self.assertEqual(me_res.json()["user"]["username"], self.username)

    def test_login_with_wrong_password_fails(self):
        """Verifies that invalid password returns 400 and attaches NO cookie."""
        response = self.client.post(
            self.login_url,
            {
                "username_or_email": self.username,
                "password": "WrongPassword123!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertNotIn("access_token", response.cookies)

    def test_login_with_unknown_user_fails(self):
        """Verifies that non-existent username/email returns 400 and attaches NO cookie."""
        response = self.client.post(
            self.login_url,
            {
                "username_or_email": "nonexistent_user",
                "password": "AnyPassword123!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertNotIn("access_token", response.cookies)

    def test_login_with_inactive_account_fails(self):
        """Verifies that inactive users cannot log in."""
        self.user.is_active = False
        self.user.save()

        response = self.client.post(
            self.login_url,
            {
                "username_or_email": self.username,
                "password": self.password,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("inactive", response.json()["non_field_errors"][0].lower())
        self.assertNotIn("access_token", response.cookies)

    def test_logout_wipes_cookie_and_terminates_session(self):
        """Verifies logout wipes the cookie and subsequent requests return 401."""
        # 1. Login
        self.client.post(
            self.login_url,
            {
                "username_or_email": self.username,
                "password": self.password,
            },
            format="json",
        )

        # 2. Logout
        logout_res = self.client.post(self.logout_url)
        self.assertEqual(logout_res.status_code, status.HTTP_200_OK)

        # 3. Check cookie deletion
        access_cookie = logout_res.cookies.get("access_token")
        self.assertTrue(access_cookie.value == "" or access_cookie["max-age"] == 0)

        # 4. Clear client cookies to simulate browser clearing and test unauthenticated
        self.client.cookies.clear()
        unauth_res = self.client.get(self.me_url)
        self.assertEqual(unauth_res.status_code, status.HTTP_401_UNAUTHORIZED)
