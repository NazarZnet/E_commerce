from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Subscriber, Newsletter
from tinymce.widgets import TinyMCE
from django.db import models


@admin.register(Subscriber)
class SubscriberAdmin(ModelAdmin):
    list_display = ("email", "created_at")
    search_fields = ("email",)


@admin.register(Newsletter)
class NewsletterAdmin(admin.ModelAdmin):
    list_display = ("subject", "created_at")
    search_fields = ("subject",)
    readonly_fields = ("created_at",)
    compressed_fields = ["message"]

    formfield_overrides = {
        models.TextField: {"widget": TinyMCE()},
    }
