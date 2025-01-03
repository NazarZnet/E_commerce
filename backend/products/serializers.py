from rest_framework import serializers
from .models import Product, ProductGallery, Category, ProductCharacteristic


class ProductGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductGallery
        fields = ["id", "image", "caption"]


class ProductCharacteristicSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCharacteristic
        fields = ["name", "value"]


class ProductSerializer(serializers.ModelSerializer):
    gallery = ProductGallerySerializer(many=True, read_only=True)
    category = serializers.SerializerMethodField()
    discounted_price = serializers.SerializerMethodField()

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
            "stock",
            "category",
            "is_featured",
            "gallery",
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


class ProductDetailSerializer(serializers.ModelSerializer):
    characteristics = ProductCharacteristicSerializer(many=True, read_only=True)
    gallery = ProductGallerySerializer(many=True, read_only=True)
    category = serializers.SerializerMethodField()
    discounted_price = serializers.SerializerMethodField()

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

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "icon",
            "products",
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
