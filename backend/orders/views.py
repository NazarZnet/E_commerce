from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from django.urls import reverse
from rest_framework.viewsets import ModelViewSet
from .models import Order
from .serializers import OrderSerializer


class OrderViewSet(ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def perform_create(self, serializer):
        order = serializer.save()
        items = order.items.all()

        # Generate admin URL
        admin_url = f"{settings.SITE_URL}{reverse('admin:orders_order_change', args=[order.id])}"

        items_data = [
            {
                "product_name": item.product.name,
                "quantity": item.quantity,
                "price": item.product.discounted_price(),
                "product_image": (
                    f"{settings.SITE_URL}{item.product.gallery.first().image.url}"
                    if item.product.gallery.exists()
                    else ""
                ),
            }
            for item in items
        ]

        # Render email content
        email_content = render_to_string(
            "email/orderCreated.html",
            {
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

        # Send the email
        send_mail(
            subject=f"RideFuture: New Order #{order.id}",
            message="",
            html_message=email_content,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[settings.ADMIN_EMAIL],
        )
