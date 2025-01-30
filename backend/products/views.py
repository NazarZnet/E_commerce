from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Category, ProductComment
from .serializers import (
    ProductSerializer,
    CategorySerializer,
    ProductCommentSerializer,
)
from rest_framework.decorators import action
from rest_framework.response import Response
from .pagination import CustomPagination
from rest_framework.exceptions import NotFound
from django.utils.translation import activate


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = "slug"

    def get_queryset(self):
        lang = self.request.query_params.get("lang")
        if lang:
            activate(lang)
        return super().get_queryset()

    def get_serializer_context(self):
        """
        Add context to determine whether to include products.
        """
        context = super().get_serializer_context()
        context["show_products"] = (
            self.action == "list"
        )  # Show products only in the list view
        return context


from rest_framework.permissions import IsAuthenticated


class ProductCommentViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]

    queryset = ProductComment.objects.all()
    serializer_class = ProductCommentSerializer

    def perform_create(self, serializer):
        # Automatically set the user and product when a rating is created
        serializer.save(user=self.request.user)


class ProductViewSet(ModelViewSet):
    """
    ViewSet for managing products.
    """

    queryset = Product.objects.all()
    pagination_class = CustomPagination
    serializer_class = ProductSerializer
    # permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = "slug"  # Use slug for product URLs

    # Filters
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["is_featured", "price"]  # Other filters
    search_fields = ["name", "description"]  # Search by name or description
    ordering_fields = ["price", "created_at", "updated_at"]
    ordering = ["-created_at"]  # Default ordering

    def get_queryset(self):
        """
        Optionally filter products by category slug or featured flag.
        """
        lang = self.request.query_params.get("lang")
        if lang:
            activate(lang)
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

    @action(detail=True, methods=["get"])
    def similar(self, request, slug=None):
        """
        Custom action to get similar products by category.
        """
        try:
            product = self.get_object()  # Get the current product by slug
        except Product.DoesNotExist:
            raise NotFound(detail="Product not found.")

        # Fetch similar products in the same category, excluding the current product
        similar_products = Product.objects.filter(category=product.category).exclude(
            slug=product.slug
        )

        # Apply pagination
        page = self.paginate_queryset(similar_products)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        # Serialize and return similar products
        serializer = self.get_serializer(similar_products, many=True)
        return Response(serializer.data)
