from django.urls import path
from .views import (
    GenerateTempPasswordView,
    UserUpdateView,
    VerifyTempPasswordView,
    ProfileView,
)
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path(
        "auth/generate-temp-password/",
        GenerateTempPasswordView.as_view(),
        name="generate_temp_password",
    ),
    path(
        "auth/verify-temp-password/",
        VerifyTempPasswordView.as_view(),
        name="verify_temp_password",
    ),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("users/update/", UserUpdateView.as_view(), name="user_update"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
