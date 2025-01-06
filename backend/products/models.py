from django.db import models

from django.db import models
from django.utils.text import slugify
from users.models import User


def product_image_upload_path(instance, filename):
    """Generate upload path for product gallery images."""
    return f"product_gallery/{slugify(instance.product.name)}/{filename}"


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=150, unique=True, blank=True)
    icon = models.TextField(
        blank=True, null=True, help_text="Store an SVG icon as a string"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0.0,
        help_text="Discount percentage (e.g., 10.0 for 10%)",
    )
    stock = models.PositiveIntegerField(default=0)
    category = models.ForeignKey(
        Category, related_name="products", on_delete=models.CASCADE
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
        """
        Calculate and return the average rating of the product.
        """
        ratings = self.ratings.all()
        if ratings.exists():
            return ratings.aggregate(models.Avg("stars"))["stars__avg"]
        return None  # No ratings ye

    def __str__(self):
        return self.name


class ProductRating(models.Model):
    product = models.ForeignKey(
        Product, related_name="ratings", on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        User, related_name="product_ratings", on_delete=models.CASCADE
    )
    stars = models.PositiveIntegerField(
        choices=[(i, f'{i} Star{"s" if i > 1 else ""}') for i in range(1, 6)], default=5
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = (
            "product",
            "user",
        )  # Prevent duplicate ratings by the same user

    def __str__(self):
        return f"{self.product.name} - {self.stars} Stars by {self.user.email}"


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
    name = models.CharField(max_length=100)
    value = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name}: {self.value} ({self.product.name})"
