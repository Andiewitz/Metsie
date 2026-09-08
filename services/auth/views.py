"""Authentication Views Module

Provides endpoints for Registration, Login, Logout, and Current User retrieval.
Coordinates with jwt.py to attach or wipe 7-day httpOnly cookies.
"""

from rest_framework import exceptions, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .jwt import delete_auth_cookie, generate_jwt_token, set_auth_cookie
from .serializers import LoginSerializer, RegisterSerializer, UserSerializer


class RegisterView(APIView):
    """User registration endpoint.

    On successful signup, immediately issues a 7-day httpOnly JWT cookie
    so the user is authenticated seamlessly without storing tokens in localStorage.
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        token = generate_jwt_token(user)

        response = Response(
            {"message": "Registration successful.", "user": UserSerializer(user).data}, status=status.HTTP_201_CREATED
        )
        set_auth_cookie(response, token)
        return response


class LoginView(APIView):
    """User authentication endpoint.

    Validates username/email and password, then issues a 7-day httpOnly JWT cookie.
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        try:
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except exceptions.PermissionDenied as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_403_FORBIDDEN)

        user = serializer.validated_data["user"]
        token = generate_jwt_token(user)

        response = Response(
            {"message": "Login successful.", "user": UserSerializer(user).data}, status=status.HTTP_200_OK
        )
        set_auth_cookie(response, token)
        return response


class LogoutView(APIView):
    """Logout endpoint.

    Clears the httpOnly access_token cookie from the client browser.
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        response = Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)
        delete_auth_cookie(response)
        return response


class CurrentUserView(APIView):
    """Session check endpoint (/api/auth/me/).

    Used by the frontend on application load to verify session and hydrate user state.
    Requires valid httpOnly cookie or Bearer token.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({"user": serializer.data}, status=status.HTTP_200_OK)
