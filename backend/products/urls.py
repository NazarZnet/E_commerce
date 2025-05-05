from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet, ProductCommentViewSet

router = DefaultRouter()
router.register(r"products", ProductViewSet)
router.register(r"categories", CategoryViewSet)
router.register(r"comments", ProductCommentViewSet)

urlpatterns = router.urls
