from django.contrib import admin
from .models import Category, Product, ProductGallery, ProductCharacteristic


class ProductGalleryInline(admin.TabularInline):
    """
    Inline for managing product gallery images within the Product admin.
    """

    model = ProductGallery
    extra = 1  # Number of empty forms to display
    fields = ("image", "caption")  # Fields to display in the inline form


class ProductCharacteristicInline(admin.TabularInline):
    """
    Inline for managing product characteristics within the Product admin.
    """

    model = ProductCharacteristic
    extra = 1  # Number of empty forms to display
    fields = ("name", "value")  # Fields to display in the inline form


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "created_at", "updated_at")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)
    list_filter = ("created_at", "updated_at")
    readonly_fields = ("created_at", "updated_at")


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Product model.
    """

    list_display = (
        "name",
        "price",
        "discount_percentage",
        "stock",
        "category",
        "is_featured",
        "created_at",
    )
    list_filter = (
        "is_featured",
        "category",
        "created_at",
    )  # Filters for easy navigation
    search_fields = ("name", "description")  # Search functionality
    prepopulated_fields = {
        "slug": ("name",)
    }  # Auto-generate the slug field from the name
    inlines = [
        ProductGalleryInline,
        ProductCharacteristicInline,
    ]  # Add inlines for gallery and characteristics
    readonly_fields = (
        "discounted_price",
    )  # Show discounted price as a read-only calculated field

    def discounted_price(self, obj):
        """
        Display the discounted price in the admin panel.
        """
        return obj.discounted_price()

    discounted_price.short_description = "Discounted Price"


@admin.register(ProductGallery)
class ProductGalleryAdmin(admin.ModelAdmin):
    """
    Admin configuration for the ProductGallery model.
    """

    list_display = ("product", "image", "caption")  # Fields to display in the list view


@admin.register(ProductCharacteristic)
class ProductCharacteristicAdmin(admin.ModelAdmin):
    """
    Admin configuration for the ProductCharacteristic model.
    """

    list_display = ("product", "name", "value")  # Fields to display in the list view
    search_fields = (
        "product__name",
        "name",
    )  # Search by product name and characteristic name
