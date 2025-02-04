from django.shortcuts import get_object_or_404, redirect
import stripe
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.urls import reverse
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet

from users.models import User
from .models import Order
from .serializers import OrderSerializer
from .stripe import (
    create_stripe_products_from_order,
    get_or_create_stripe_customer,
)
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from users.serializers import UserSerializer


class OrderViewSet(ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()

        # Generate Stripe line items
        try:
            line_items = create_stripe_products_from_order(order)
        except Exception as e:
            return Response(
                {"error": f"Failed to create Stripe products and prices: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            customer_id = get_or_create_stripe_customer(order.user)
        except Exception as e:
            return Response(
                {"error": f"Failed to create Stripe customer: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create Stripe Checkout Session
        try:
            session = stripe.checkout.Session.create(
                customer=customer_id,
                line_items=line_items,
                mode="payment",
                success_url=f"{settings.SITE_URL}/api/order-success/{order.id}/",
                cancel_url=f"{settings.SITE_URL}/api/order-cancel/{order.id}/",
                metadata={"order_id": order.id},
            )
            checkout_url = session.url
        except Exception as e:
            return Response(
                {"error": f"Failed to create Stripe Checkout Session: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        refresh = RefreshToken.for_user(order.user)

        # Return checkout URL and order details
        return Response(
            {
                "message": "Order created successfully.",
                "order": serializer.data,
                "checkout_url": checkout_url,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": UserSerializer(order.user).data,
            },
            status=status.HTTP_201_CREATED,
        )


class OrderSuccessView(APIView):
    """
    Handles the success callback from Stripe after payment.
    """

    permission_classes = [AllowAny]

    def get(self, request, order_id):
        order = get_object_or_404(Order, id=order_id)

        # Mark the order as paid
        order.status = "confirmed"
        for item in order.items.all():
            if item.product.stock >= item.quantity:
                item.product.stock -= item.quantity
                item.product.save()
            else:
                raise ValueError(f"Not enough stock for product {item.product.name}")

        order.save()

        self._send_order_email(order)

        success_url = f"{settings.FRONTEND_SITE_URL}/order/finished?success=true"

        return redirect(success_url)

    def _send_order_email(self, order):
        """
        Sends an order notification email to the admin.
        """
        items = order.items.all()
        admin_url = f"{settings.SITE_URL}{reverse('admin:orders_order_change', args=[order.id])}"

        items_data = [
            {
                "product_name": item.product.name,
                "quantity": item.quantity,
                "price": item.product.discounted_price(),
                "product_image": (
                    f"{item.product.gallery.first().image.url}"
                    if item.product.gallery.exists()
                    else ""
                ),
            }
            for item in items
        ]

        email_content = render_to_string(
            "email/orderCreated.html",
            {
                "logo_url": f"{settings.SITE_URL}/static/logo.png",
                "first_name": order.user.first_name,
                "last_name": order.user.last_name,
                "email": order.user.email,
                "phone": order.phone,
                "address": order.address,
                "city": order.city,
                "postal_code": order.postal_code,
                "country": order.country,
                "total_price": order.total_price,
                "items": items_data,
                "order_notes": order.order_notes,
                "admin_url": admin_url,
            },
        )

        admin_emails = User.objects.filter(is_superuser=True).values_list(
            "email", flat=True
        )

        send_mail(
            subject=f"RideFuture: New Order #{order.id}",
            message="",
            html_message=email_content,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=list(admin_emails),
        )


class OrderCancelView(APIView):
    """
    Handles the cancel callback from Stripe if payment fails or is canceled.
    """

    permission_classes = [AllowAny]

    def get(self, request, order_id):
        order = get_object_or_404(Order, id=order_id)
        order.delete()

        cancel_url = f"{settings.FRONTEND_SITE_URL}/order/finished?success=false"

        return redirect(cancel_url)
