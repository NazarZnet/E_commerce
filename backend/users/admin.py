from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

from unfold.admin import ModelAdmin
from unfold.forms import UserChangeForm, UserCreationForm, AdminPasswordChangeForm


class UserAdmin(BaseUserAdmin, ModelAdmin):
    model = User
    list_display = ("email", "first_name", "last_name", "is_staff", "is_active")
    list_filter = ("is_staff", "is_active")
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ("first_name", "last_name")}),
        (
            "Permissions",
            {
                "fields": (
                    "is_staff",
                    "is_active",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Payments", {"fields": ("stripe_customer_id",)}),
        ("Important dates", {"fields": ("date_joined",)}),
    )
    readonly_fields = ("date_joined",)
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2", "is_staff", "is_active"),
            },
        ),
    )
    search_fields = ("email",)
    ordering = ("email",)
    form = UserChangeForm
    add_form = UserCreationForm
    change_password_form = AdminPasswordChangeForm


admin.site.register(User, UserAdmin)
