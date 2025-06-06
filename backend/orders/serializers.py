from rest_framework import serializers

from products.serializers import ProductSerializer
from .models import Order, OrderItem
from products.models import Product
from users.models import User


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(
        read_only=True
    )  # Use ProductSerializer for detailed product data
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source="product", write_only=True
    )
    long_term_guarantee_selected = serializers.BooleanField(default=False)

    class Meta:
        model = OrderItem
        fields = ["product", "product_id", "quantity", "long_term_guarantee_selected"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    email = serializers.EmailField(write_only=True)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    status = serializers.CharField(read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "status",
            "phone",
            "country",
            "address",
            "postal_code",
            "city",
            "order_notes",
            "total_price",
            "items",
            "created_at",
        ]
        read_only_fields = ["status", "id", "created_at"]

    def create(self, validated_data):
        # Extract user data
        email = validated_data.pop("email")
        first_name = validated_data.pop("first_name")
        last_name = validated_data.pop("last_name")

        # Check if user exists or create a new one
        user, created = User.objects.get_or_create(
            email=email, defaults={"first_name": first_name, "last_name": last_name}
        )

        # Create the order
        items_data = validated_data.pop("items")
        order = Order.objects.create(user=user, **validated_data)

        # Create the order items
        for item_data in items_data:
            product = item_data["product"]
            quantity = item_data["quantity"]
            long_term_guarantee_selected = item_data.get(
                "long_term_guarantee_selected", False
            )
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                long_term_guarantee_selected=long_term_guarantee_selected,
            )

        # Recalculate total price including guarantee
        order.calculate_total_price()
        return order
