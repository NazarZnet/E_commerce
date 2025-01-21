from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Category,
    Product,
    ProductGallery,
    ProductCharacteristic,
    ProductComment,
    CharacteristicType,
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
)


class CustomSliderNumericFilter(SliderNumericFilter):
    MAX_DECIMALS = 2
    STEP = 10


class ProductCommentInline(TabularInline):
    model = ProductComment
    extra = 1
    fields = ("user", "rating", "comment", "created_at", "updated_at")
    readonly_fields = ("created_at", "updated_at")
    ordering = ("-created_at",)
    verbose_name = "Product Comment"
    verbose_name_plural = "Product Comments"


class ProductGalleryInline(TabularInline):
    """
    Inline for managing product gallery images within the Product admin.
    """

    model = ProductGallery
    extra = 1
    fields = ("image", "caption")  # Fields to display in the inline form


class ProductCharacteristicInline(TabularInline):
    model = ProductCharacteristic
    extra = 1

    def formfield_for_foreignkey(self, db_field, request=None, **kwargs):
        if db_field.name == "characteristic_type":
            if request.resolver_match and "object_id" in request.resolver_match.kwargs:
                product_id = request.resolver_match.kwargs["object_id"]
                product = Product.objects.filter(pk=product_id).first()
                if product and product.category:
                    kwargs["queryset"] = CharacteristicType.objects.filter(
                        categories=product.category
                    )
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


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
        ProductCommentInline,
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


@admin.register(ProductComment)
class ProductCommentAdmin(ModelAdmin):
    list_display = (
        "product",
        "user",
        "stars_display",
        "comment_preview",
        "created_at",
        "updated_at",
    )
    list_filter = ("rating", "created_at")
    search_fields = ("product__name", "user__email", "comment")
    ordering = ("-created_at",)

    def stars_display(self, obj):
        """
        Render stars as icons in the admin panel.
        """
        if obj.rating:
            return format_html("★" * obj.rating + "☆" * (5 - obj.rating))
        return "No Rating"

    stars_display.short_description = "Stars"

    def comment_preview(self, obj):
        """
        Show a preview of the comment in the admin panel.
        """
        if obj.comment:
            return obj.comment[:50] + ("..." if len(obj.comment) > 50 else "")
        return "No Comment"

    comment_preview.short_description = "Comment Preview"


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

    list_display = (
        "product",
        "characteristic_type",
        "value",
    )  # Fields to display in the list view
    search_fields = (
        "product__name",
        "characteristic_type__name",
    )  # Search by product name and characteristic name


@admin.register(CharacteristicType)
class CharacteristicTypeAdmin(ModelAdmin):
    list_display = ("name", "data_type", "suffix")
    filter_horizontal = ("categories",)  # Easier UI for many-to-many relationships
