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
    readonly_fields = ['product_price']

    def product_price(self, instance):
        return f"${instance.product.discounted_price()}"  # Format price as desired
    product_price.short_description = "Product Price"  # Column name in the admin


@admin.register(Order)
class OrderAdmin(ModelAdmin):
    """
    Admin view for orders.
    """
    list_display = ['id', 'user', 'total_price', 'created_at', 'updated_at']
    list_filter = ['created_at', 'updated_at', 'country']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'phone']
    readonly_fields = ['total_price', 'created_at', 'updated_at']
    inlines = [OrderItemInline]



@admin.register(OrderItem)
class OrderItemAdmin(ModelAdmin):
    """
    Admin view for order items.
    """
    list_display = ['id', 'order', 'product', 'quantity']
    list_filter = ['order__created_at', 'product']
    search_fields = ['order__id', 'product__name']