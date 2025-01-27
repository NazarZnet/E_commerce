from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import OrderViewSet, OrderSuccessView, OrderCancelView

router = DefaultRouter()
router.register(r"orders", OrderViewSet, basename="order")

custom_urls = [
    path(
        "order-success/<int:order_id>/",
        OrderSuccessView.as_view(),
        name="order_success",
    ),
    path(
        "order-cancel/<int:order_id>/", OrderCancelView.as_view(), name="order_cancel"
    ),
]

# Combine the router URLs and custom URLs
urlpatterns = [
    path("", include(router.urls)),  # Include the ViewSet URLs
    *custom_urls,  # Add the custom success and cancel URLs
]
