from django.contrib import admin
from django.utils.html import format_html
from unfold.admin import ModelAdmin, TabularInline
from .models import Order, OrderItem


class OrderItemInline(TabularInline):
    """
    Inline view for order items in the admin interface.
    """

    model = OrderItem
    extra = 1
    can_delete = True
    readonly_fields = ["product_price", "product_image", "long_term_guarantee"]

    def product_price(self, instance):
        """
        Display the discounted price of the product.
        """
        return f"${instance.product.discounted_price()}"  # Format price as desired

    def product_image(self, instance):
        """
        Display the product image as a thumbnail.
        """
        if instance.product.gallery.exists():
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover;" alt="{}">',
                instance.product.gallery.first().image.url,
                instance.product.name,
            )
        return "No Image"

    def long_term_guarantee(self, instance):
        """
        Display if the long-term guarantee is selected.
        """
        return "✅ Yes" if instance.long_term_guarantee_selected else "❌ No"

    long_term_guarantee.short_description = (
        "Long-Term Guarantee"  # Column name in admin
    )
    product_price.short_description = "Product Price"
    product_image.short_description = "Product Image"


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
class OrderItemAdmin(admin.ModelAdmin):
    """
    Admin view for order items.
    """

    list_display = [
        "id",
        "order",
        "product",
        "quantity",
        "long_term_guarantee_selected",
        "get_total_price",
    ]
    list_filter = ["order__created_at", "product", "long_term_guarantee_selected"]
    search_fields = ["order__id", "product__name"]
    readonly_fields = ["get_total_price"]

    def get_total_price(self, obj):
        """
        Display total price of the item including long-term guarantee if selected.
        """
        base_price = obj.product.discounted_price() * obj.quantity
        guarantee_cost = 50 * obj.quantity if obj.long_term_guarantee_selected else 0
        return f"${base_price + guarantee_cost}"

    get_total_price.short_description = "Total Price"
