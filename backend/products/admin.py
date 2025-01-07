from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Category,
    Product,
    ProductGallery,
    ProductCharacteristic,
    ProductRating,
)
from unfold.admin import ModelAdmin, TabularInline
from unfold.contrib.filters.admin import (
    RangeDateFilter,
    RangeNumericFilter,
    SliderNumericFilter,
)
from import_export.admin import ImportExportModelAdmin
from unfold.contrib.import_export.forms import (
    ExportForm,
    ImportForm,
    SelectableFieldsExportForm,
)


class CustomSliderNumericFilter(SliderNumericFilter):
    MAX_DECIMALS = 2
    STEP = 10


class ProductRatingInline(TabularInline):
    model = ProductRating
    extra = 1
    fields = ("user", "stars", "created_at")
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)


class ProductGalleryInline(TabularInline):
    """
    Inline for managing product gallery images within the Product admin.
    """

    model = ProductGallery
    extra = 1  # Number of empty forms to display
    fields = ("image", "caption")  # Fields to display in the inline form


class ProductCharacteristicInline(TabularInline):
    """
    Inline for managing product characteristics within the Product admin.
    """

    model = ProductCharacteristic
    extra = 1  # Number of empty forms to display
    fields = ("name", "value")  # Fields to display in the inline form


@admin.register(Category)
class CategoryAdmin(ModelAdmin, ImportExportModelAdmin):
    import_form_class = ImportForm
    export_form_class = ExportForm
    list_display = ("name", "slug", "created_at", "updated_at")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)
    list_filter = (("created_at", RangeDateFilter), ("updated_at", RangeDateFilter))
    readonly_fields = ("created_at", "updated_at")


@admin.register(Product)
class ProductAdmin(ModelAdmin, ImportExportModelAdmin):
    """
    Admin configuration for the Product model.
    """

    import_form_class = ImportForm
    export_form_class = ExportForm

    list_display = (
        "name",
        "price",
        "discount_percentage",
        "stock",
        "category",
        "is_featured",
        "created_at",
    )
    list_editable = ("discount_percentage", "price", "is_featured", "stock")
    list_filter = (
        "is_featured",
        "category",
        ("price", CustomSliderNumericFilter),
        ("discount_percentage", CustomSliderNumericFilter),
        ("created_at", RangeDateFilter),
        ("updated_at", RangeDateFilter),
    )  # Filters for easy navigation
    list_filter_submit = True
    search_fields = ("name", "description")  # Search functionality
    prepopulated_fields = {
        "slug": ("name",)
    }  # Auto-generate the slug field from the name
    inlines = [
        ProductGalleryInline,
        ProductCharacteristicInline,
        ProductRatingInline,
    ]
    readonly_fields = (
        "discounted_price",
    )  # Show discounted price as a read-only calculated field

    def discounted_price(self, obj):
        """
        Display the discounted price in the admin panel.
        """
        return obj.discounted_price()

    discounted_price.short_description = "Discounted Price"


@admin.register(ProductRating)
class ProductRatingAdmin(ModelAdmin):
    list_display = ("product", "user", "stars_display", "created_at")
    list_filter = ("stars", "created_at")
    search_fields = ("product__name", "user__email")
    ordering = ("-created_at",)

    def stars_display(self, obj):
        """
        Render stars as icons in the admin panel.
        """
        return format_html("★" * obj.stars + "☆" * (5 - obj.stars))

    stars_display.short_description = "Stars"


@admin.register(ProductGallery)
class ProductGalleryAdmin(ModelAdmin):
    """
    Admin configuration for the ProductGallery model.
    """

    list_display = ("product", "image")  # Fields to display in the list view


@admin.register(ProductCharacteristic)
class ProductCharacteristicAdmin(ModelAdmin):
    """
    Admin configuration for the ProductCharacteristic model.
    """

    list_display = ("product", "name", "value")  # Fields to display in the list view
    search_fields = (
        "product__name",
        "name",
    )  # Search by product name and characteristic name
