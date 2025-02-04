from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic.base import RedirectView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("tinymce/", include("tinymce.urls")),
    path("", RedirectView.as_view(url="/api/docs/", permanent=True)),
    path("api/", include("users.urls")),
    path("api/", include("products.urls")),
    path("api/", include("orders.urls")),
    path("api/", include("newsletter.urls")),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
