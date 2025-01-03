from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet, ProductRatingViewSet

router = DefaultRouter()
router.register(r"products", ProductViewSet)
router.register(r"categories", CategoryViewSet)
router.register(r"ratings", ProductRatingViewSet)

urlpatterns = router.urls
