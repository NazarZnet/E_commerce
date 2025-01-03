from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Category, ProductRating
from .serializers import (
    ProductSerializer,
    CategorySerializer,
    ProductDetailSerializer,
    ProductRatingSerializer,
)
from .pagination import CustomPagination


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = "slug"

    def get_serializer_context(self):
        """
        Add context to determine whether to include products.
        """
        context = super().get_serializer_context()
        context["show_products"] = (
            self.action == "list"
        )  # Show products only in the list view
        return context


class ProductRatingViewSet(ModelViewSet):
    queryset = ProductRating.objects.all()
    serializer_class = ProductRatingSerializer

    def perform_create(self, serializer):
        # Automatically set the user and product when a rating is created
        # serializer.save(user=self.request.user)
        serializer.save()


class ProductViewSet(ModelViewSet):
    """
    ViewSet for managing products.
    """

    queryset = Product.objects.all()
    pagination_class = CustomPagination
    # permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = "slug"  # Use slug for product URLs

    # Filters
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["is_featured", "price"]  # Other filters
    search_fields = ["name", "description"]  # Search by name or description
    ordering_fields = ["price", "created_at", "updated_at"]
    ordering = ["-created_at"]  # Default ordering

    def get_serializer_class(self):
        """
        Use a detailed serializer for retrieve actions.
        """
        if self.action == "retrieve":
            return ProductDetailSerializer
        return ProductSerializer

    def get_queryset(self):
        """
        Optionally filter products by category slug or featured flag.
        """
        queryset = super().get_queryset()

        # Filter by category slug
        category_slug = self.request.query_params.get("category")
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)

        # Filter by featured products
        featured = self.request.query_params.get("featured")
        if featured:
            queryset = queryset.filter(is_featured=True)

        return queryset
