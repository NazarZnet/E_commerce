from django.contrib import admin

# Register your models here.
from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline
from .models import Order, OrderItem


class OrderItemInline(TabularInline):
    """
    Inline view for order items in the admin interface.
    """

    model = OrderItem
    extra = 1
    can_delete = True
    readonly_fields = ["product_price", "product_image"]

    def product_price(self, instance):
        """
        Display the discounted price of the product.
        """
        return f"${instance.product.discounted_price()}"  # Format price as desired

    def product_image(self, instance):
        """
        Display the product image as a thumbnail.
        """
        from django.utils.html import format_html

        if instance.product.gallery.exists():

            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover;" alt="{}">',
                instance.product.gallery.first().image.url,
                instance.product.name,
            )
        return "No Image"

    product_price.short_description = "Product Price"  # Column name in the admin
    product_image.short_description = "Product Image"  # Column name in the admin


@admin.register(Order)
class OrderAdmin(ModelAdmin):
    """
    Admin view for orders.
    """

    list_display = ["id", "user", "total_price", "status", "created_at", "updated_at"]
    list_filter = ["created_at", "updated_at", "country"]
    search_fields = ["user__email", "user__first_name", "user__last_name", "phone"]
    readonly_fields = ["total_price", "created_at", "updated_at"]
    list_editable = ["status"]
    inlines = [OrderItemInline]


@admin.register(OrderItem)
class OrderItemAdmin(ModelAdmin):
    """
    Admin view for order items.
    """

    list_display = ["id", "order", "product", "quantity"]
    list_filter = ["order__created_at", "product"]
    search_fields = ["order__id", "product__name"]
