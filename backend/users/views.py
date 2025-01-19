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


class GenerateTempPasswordView(APIView):
    """
    Generate a temporary password and send it to the user's email.
    """

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        from django.core.mail import EmailMessage
        from django.template.loader import render_to_string

        serializer = TempPasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]

            html_content = render_to_string("email/tempPassword.html", {"user": user})
            email = EmailMessage(
                subject="Your Temporary Password",
                body=html_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[user.email],
            )
            email.content_subtype = "html"  # Main content is HTML
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
from rest_framework_simplejwt.authentication import JWTAuthentication


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user

        # Fetch user orders
        orders = Order.objects.filter(user=user)
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
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
