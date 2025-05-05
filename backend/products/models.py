from django.db import models
from django.utils.text import slugify
from users.models import User
from django.core.exceptions import ValidationError


def product_image_upload_path(instance, filename):
    """Generate upload path for product gallery images."""
    return f"product_gallery/{slugify(instance.product.name)}/{filename}"


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=150, unique=True, blank=True)
    icon = models.TextField(
        blank=True, null=True, help_text="Store an SVG icon as a string"
    )
    long_term_guarantee = models.BooleanField(
        default=False, help_text="Guarantee 24 mounth for products"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class CharacteristicType(models.Model):
    name = models.CharField(max_length=100)
    data_type = models.CharField(
        max_length=50,
        choices=[
            ("string", "String"),
            ("integer", "Integer"),
            ("float", "Float"),
            ("boolean", "Boolean"),
        ],
        default="string",
    )
    suffix = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text="Optional suffix to display with the value, e.g., 'km/h', '%'.",
    )
    categories = models.ManyToManyField(
        Category, related_name="characteristics", blank=True
    )

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField()
    price = models.DecimalField(
        max_digits=10, decimal_places=2, help_text="Price for a product in Kč"
    )
    discount_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0.0,
        help_text="Discount percentage (e.g., 10.0 for 10%)",
    )
    stock = models.PositiveIntegerField(default=0)
    category = models.ForeignKey(
        "Category", related_name="products", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_featured = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def discounted_price(self):
        """Calculate and return the price after discount."""
        if self.discount_percentage > 0:
            discount = (self.price * self.discount_percentage) / 100
            return self.price - discount
        return self.price

    def average_rating(self):
        """Calculate and return the average rating of the product."""
        ratings = self.product_comments.exclude(rating__isnull=True).values_list(
            "rating", flat=True
        )
        if ratings:
            return sum(ratings) / len(ratings)
        return None  # No ratings yet

    def total_ratings(self):
        """Return the total number of ratings."""
        return self.comments.exclude(rating__isnull=True).count()

    def total_comments(self):
        """Return the total number of comments."""
        return self.comments.exclude(comment__isnull=True).count()

    def __str__(self):
        return self.name


class ProductComment(models.Model):
    """
    Model for product comments and ratings.
    """

    product = models.ForeignKey(
        Product, related_name="product_comments", on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        User,
        related_name="product_comments",
        on_delete=models.CASCADE,
    )
    comment = models.TextField(blank=True, null=True)  # Optional comment
    rating = models.PositiveIntegerField(
        choices=[(i, f"{i} Star{'s' if i > 1 else ''}") for i in range(1, 6)],
        blank=True,
        null=True,
        help_text="Rating from 1 to 5 stars",
    )  # Optional rating
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product.name} - {self.user.email} - {self.rating or 'No Rating'}"


class ProductGallery(models.Model):
    product = models.ForeignKey(
        Product, related_name="gallery", on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to=product_image_upload_path)
    caption = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Gallery for {self.product.name} - {self.caption if self.caption else 'No Caption'}"


class ProductCharacteristic(models.Model):
    product = models.ForeignKey(
        Product, related_name="characteristics", on_delete=models.CASCADE
    )
    characteristic_type = models.ForeignKey(
        CharacteristicType,
        related_name="product_characteristics",
        on_delete=models.CASCADE,
    )
    value = models.CharField(max_length=255)

    def clean(self):
        """
        Validate the value field based on the data_type of the characteristic_type.
        """
        data_type = self.characteristic_type.data_type

        if data_type == "integer":
            try:
                int(self.value)
            except ValueError:
                raise ValidationError(
                    f"The value for {self.characteristic_type.name} must be an integer."
                )

        elif data_type == "float":
            try:
                float(self.value)
            except ValueError:
                raise ValidationError(
                    f"The value for {self.characteristic_type.name} must be a float."
                )

        elif data_type == "boolean":
            if self.value.lower() not in ["true", "false"]:
                raise ValidationError(
                    f"The value for {self.characteristic_type.name} must be 'true' or 'false'."
                )

    def save(self, *args, **kwargs):
        # Call clean method to validate before saving
        self.clean()
        super().save(*args, **kwargs)
