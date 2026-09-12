"""Account Setup Service Module

Dedicated handler for post-registration user onboarding and profile setup.
Kept in an independent file to isolate onboarding logic from generic auth views.
"""

from rest_framework import permissions, serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import UserProfile
from .serializers import UserSerializer


class AccountSetupSerializer(serializers.ModelSerializer):
    """Validates and applies user profile onboarding data."""

    full_name = serializers.CharField(max_length=150, required=True)
    role = serializers.CharField(max_length=100, required=False, allow_blank=True)
    bio = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = UserProfile
        fields = ["full_name", "role", "bio"]


class AccountSetupView(APIView):
    """API endpoint allowing an authenticated user to complete or update account setup."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Retrieve current onboarding status and profile data."""
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        return Response(
            {
                "is_onboarded": profile.is_onboarded,
                "full_name": profile.full_name,
                "role": profile.role,
                "bio": profile.bio,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        """Submit account setup / onboarding details."""
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = AccountSetupSerializer(profile, data=request.data, partial=True)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        profile = serializer.save()
        profile.is_onboarded = True
        profile.save()

        user_data = UserSerializer(request.user).data
        return Response(
            {"message": "Account setup completed successfully.", "user": user_data}, status=status.HTTP_200_OK
        )
