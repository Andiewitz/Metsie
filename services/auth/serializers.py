"""Serializers for Auth and User Management."""

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers

from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for the user's profile details."""

    class Meta:
        model = UserProfile
        fields = ["full_name", "bio", "company", "role", "is_onboarded", "updated_at"]


class UserSerializer(serializers.ModelSerializer):
    """Serializer for authenticated user representation."""

    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "profile", "date_joined"]


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for new user registration."""

    password = serializers.CharField(write_only=True, min_length=6, style={"input_type": "password"})
    password_confirm = serializers.CharField(write_only=True, style={"input_type": "password"})
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "password_confirm"]

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email address already exists.")
        return value.lower()

    def validate(self, data):
        if data["password"] != data["password_confirm"]:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        user = User.objects.create_user(
            username=validated_data["username"], email=validated_data["email"], password=validated_data["password"]
        )
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login with either username or email."""

    username_or_email = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True, style={"input_type": "password"})

    def validate(self, data):
        identifier = data.get("username_or_email", "").strip()
        password = data.get("password")

        user = None
        if "@" in identifier:
            # Look up by email
            try:
                matched_user = User.objects.get(email__iexact=identifier)
                user = authenticate(username=matched_user.username, password=password)
            except User.DoesNotExist:
                user = None
        else:
            user = authenticate(username=identifier, password=password)

        # Check if user exists and is inactive to give specific error
        target_user = None
        if "@" in identifier:
            target_user = User.objects.filter(email__iexact=identifier).first()
        else:
            target_user = User.objects.filter(username__iexact=identifier).first()

        if target_user and not target_user.is_active and target_user.check_password(password):
            raise serializers.ValidationError("This account is inactive.")

        if not user:
            raise serializers.ValidationError("Invalid credentials. Please check username/email and password.")

        data["user"] = user
        return data
