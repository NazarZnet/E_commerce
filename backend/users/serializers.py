import requests
from rest_framework import serializers
from .models import User
from django.conf import settings


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model with standard fields.
    """

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "is_active",
            "is_staff",
            "date_joined",
        ]
        read_only_fields = ["id", "date_joined"]  # Fields that should not be editable


class TempPasswordSerializer(serializers.Serializer):
    """
    Serializer for generating and verifying temporary passwords.
    """

    email = serializers.EmailField(write_only=True)
    temp_password = serializers.CharField(write_only=True, required=False)
    recaptcha = serializers.CharField(write_only=True, required=False)

    def validate(self, data):
        email = data.get("email")
        recaptcha_token = data.get("recaptcha")

        if recaptcha_token:
            # Verify reCAPTCHA
            recaptcha_response = requests.post(
                "https://www.google.com/recaptcha/api/siteverify",
                data={
                    "secret": settings.RECAPTCHA_SECRET_KEY,
                    "response": recaptcha_token,
                },
            ).json()

            if not recaptcha_response.get("success"):
                raise serializers.ValidationError(
                    {"recaptcha": "Invalid reCAPTCHA. Please try again."}
                )

        # Create or get the user
        user, created = User.objects.get_or_create(email=email)

        if created:
            # Set default values for new users
            user.first_name = "New"
            user.last_name = "User"
            user.save()

        # Handle temporary password verification if provided
        temp_password = data.get("temp_password", "")
        print("Temporary password", temp_password)
        if temp_password:
            if not user.verify_temp_password(temp_password):
                raise serializers.ValidationError(
                    {"message": "Invalid or expired temporary password"}
                )
        else:
            # If no password provided, generate a new one
            user.set_temp_password()
            user.save()

        data["user"] = user
        return data


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "email"]
