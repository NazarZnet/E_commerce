from rest_framework import serializers
from .models import (
    Product,
    ProductGallery,
    Category,
    ProductCharacteristic,
    ProductRating,
    CharacteristicType,
)


class CharacteristicTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CharacteristicType
        fields = ["id", "name", "data_type", "suffix"]


class ProductRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductRating
        fields = ["id", "product", "user", "stars", "created_at"]
        read_only_fields = ["id", "created_at"]


class ProductGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductGallery
        fields = ["id", "image", "caption"]


class ProductCharacteristicSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="characteristic_type.name", read_only=True)
    suffix = serializers.CharField(source="characteristic_type.suffix", read_only=True)

    class Meta:
        model = ProductCharacteristic
        fields = ["id", "name", "value", "suffix"]


class ProductSerializer(serializers.ModelSerializer):
    gallery = ProductGallerySerializer(many=True, read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    category = serializers.SerializerMethodField()
    discounted_price = serializers.SerializerMethodField()
    characteristics = ProductCharacteristicSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "price",
            "discount_percentage",
            "discounted_price",
            "average_rating",
            "stock",
            "category",
            "is_featured",
            "gallery",
            "characteristics",
            "created_at",
            "updated_at",
        ]

    def get_category(self, obj):
        """
        Return only the name and slug of the category.
        """
        return {"name": obj.category.name, "slug": obj.category.slug}

    def get_discounted_price(self, obj):
        """
        Return the discounted price using the model's method.
        """
        return obj.discounted_price()


class CategorySerializer(serializers.ModelSerializer):
    products = serializers.SerializerMethodField()
    characteristics = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "icon",
            "products",
            "characteristics",
            "created_at",
            "updated_at",
        ]

    def get_products(self, obj):
        """
        Return detailed products when accessing /categories/.
        """
        if self.context.get("show_products", False):
            return ProductSerializer(obj.products.all(), many=True).data
        return []

    def get_characteristics(self, obj):
        """
        Return all characteristics associated with this category.
        """
        characteristics = obj.characteristics.all()
        return CharacteristicTypeSerializer(characteristics, many=True).data
