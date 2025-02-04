from orders.models import Order
from orders.serializers import OrderSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.conf import settings
from .models import User
from .serializers import TempPasswordSerializer, UserSerializer, UserUpdateSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from django.utils.translation import activate

from django.core.mail import EmailMessage
from django.template.loader import render_to_string


class GenerateTempPasswordView(APIView):
    """
    Generate a temporary password and send it to the user's email after reCAPTCHA validation.
    """

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = TempPasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]

            html_content = render_to_string(
                "email/tempPassword.html",
                {
                    "user": user,
                    "logo_url": f"{settings.SITE_URL}/static/logo.png",
                    "help_url": f"{settings.FRONTEND_SITE_URL}/help",
                },
            )
            email = EmailMessage(
                subject="Your Temporary Password",
                body=html_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[user.email],
            )
            email.content_subtype = "html"
            email.send()

            return Response(
                {"message": "Temporary password sent to your email."},
                status=status.HTTP_200_OK,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyTempPasswordView(APIView):
    authentication_classes = []  # Disable authentication
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = TempPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        # Generate tokens
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Login successful.",
                "user": UserSerializer(user).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_200_OK,
        )


from rest_framework.permissions import IsAuthenticated


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        lang = request.GET.get("lang")  # Get the requested language from query params

        if lang:
            activate(lang)

        # Fetch user orders
        orders = Order.objects.filter(user=user).order_by("-created_at")
        serializer_context = {"request": request}  # Add the request to context
        orders_data = OrderSerializer(
            orders, many=True, context=serializer_context
        ).data

        return Response(
            {
                "user": UserSerializer(user, context=serializer_context).data,
                "orders": orders_data,
            },
            status=status.HTTP_200_OK,
        )


class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        user = request.user  # Get the authenticated user
        serializer = UserUpdateSerializer(
            user, data=request.data, partial=True
        )  # Allow partial updates
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    "message": "Updated user's data successfully.",
                    "user": UserSerializer(user).data,
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HelpRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        from django.utils.html import strip_tags

        email = request.data.get("email")
        subject = request.data.get("subject")
        message = request.data.get("message")

        if not email or not subject or not message:
            return Response(
                {"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Get all superusers' emails
        superuser_emails = list(
            User.objects.filter(is_superuser=True).values_list("email", flat=True)
        )

        if not superuser_emails:
            return Response(
                {"error": "No admin users found to receive the message"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # Prepare email context
        context = {
            "email": email,
            "subject": subject,
            "message": message,
            "logo_url": f"{settings.SITE_URL}/static/logo.png",
        }

        # Load HTML template
        html_message = render_to_string("email/helpRequest.html", context)
        plain_message = strip_tags(html_message)

        # Send email to all superusers
        send_mail(
            subject=f"New Help Request: {subject}",
            message=plain_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=superuser_emails,
            html_message=html_message,
        )

        return Response(
            {"message": "Your message has been sent successfully"},
            status=status.HTTP_200_OK,
        )
