from datetime import timedelta
import certifi, os

os.environ["SSL_CERT_FILE"] = certifi.where()

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-0gffldcne7qkwl8dy&sp=o@9z%x=u+p8xjd!r+2&4_5y629&5m"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

USE_I18N = True
# Application definition

INSTALLED_APPS = [
    # custom
    "unfold",
    "unfold.contrib.filters",
    "unfold.contrib.import_export",
    "modeltranslation",
    # default
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # custom apps
    "users",
    "products",
    "orders",
    "newsletter",
    # libs,
    "rest_framework",
    "rest_framework_simplejwt",
    "django_filters",
    "corsheaders",
    "import_export",
    "tinymce",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "backend.wsgi.application"


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 50,
    "COERCE_DECIMAL_TO_STRING": False,
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
}
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=2),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": False,
    "AUTH_HEADER_TYPES": ("Bearer",),
}
USE_HTTPS = False

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_USE_TLS = True
EMAIL_PORT = 587
EMAIL_HOST_USER = "nazarznetynyak123@gmail.com"
EMAIL_HOST_PASSWORD = "zqpj ixwq kixn sfka"

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
]
CSRF_COOKIE_SECURE = False  # True in production
CSRF_COOKIE_HTTPONLY = True
SESSION_COOKIE_SECURE = False  # True in production
SESSION_COOKIE_HTTPONLY = True
# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

STATIC_URL = "/static/"

STATICFILES_DIRS = [
    BASE_DIR / "static",
]

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "static/media"
# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "users.User"

SITE_URL = "http://127.0.0.1:8000"
FRONTEND_SITE_URL = "http://localhost:5173"
ADMIN_EMAIL = "nazarznetynyak123@gmail.com"


from django.templatetags.static import static
from django.utils.translation import gettext_lazy as _

UNFOLD = {
    "SITE_TITLE": "RideFuture",
    "SITE_HEADER": "Ride Future",
    "SITE_URL": "/",
    "SITE_ICON": {
        "light": lambda request: static("logo.png"),  # light mode
        "dark": lambda request: static("logo.png"),  # dark mode
    },
    # "SITE_LOGO": lambda request: static("logo.svg"),  # both modes, optimise for 32px height
    "SITE_LOGO": {
        "light": lambda request: static("logo.png"),  # light mode
        "dark": lambda request: static("logo.png"),  # dark mode
    },
    "THEME": "light",  # Force theme: "dark" or "light". Will disable theme switcher
    "LOGIN": {
        "image": lambda request: static("logo.png"),
    },
    "COLORS": {
        "primary": {
            "50": "255 247 237",
            "100": "255 237 213",
            "200": "254 215 170",
            "300": "253 186 116",
            "400": "251 146 60",
            "500": "249 115 22",
            "600": "234 88 12",
            "700": "194 65 12",
            "800": "154 52 18",
            "900": "124 45 18",
            "950": "67 20 7",
        },
    },
    "EXTENSIONS": {
        "modeltranslation": {
            "flags": {
                "en": "🇺🇸",
                "cs": "🇨🇿",
            },
        },
    },
}

TINYMCE_DEFAULT_CONFIG = {
    "height": "500px",
    "width": "720px",
    "menubar": "file edit view insert format tools table help",
    "plugins": "advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code "
    "fullscreen insertdatetime media table paste code help wordcount spellchecker",
    "toolbar": "undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft "
    "aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor "
    "backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | "
    "fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | "
    "a11ycheck ltr rtl | showcomments addcomment code",
    "custom_undo_redo_levels": 10,
}

LANGUAGES = (
    ("en", "English"),
    ("cs", "Czech"),
)
MODELTRANSLATION_DEFAULT_LANGUAGE = "en"
MODELTRANSLATION_FALLBACK_LANGUAGES = ("en", "cs")
# Payment
STRIPE_PUBLISHABLE_KEY = "pk_test_51QkXPeP4nZmouXJpX8eBtbRiPrYgJQ23nzAW11wWH18H9YcXzq01SxOPYGZX4inF7FE9s5slPQlsOtKwhthbQauY00Uqxpl3nR"
STRIPE_SECRET_KEY = "sk_test_51QkXPeP4nZmouXJp5LMSHQu2OaXP8TvUY8gvdryvm2c64iICKkxgo2qReDApcPBA1YvsllXucFX9EJr7L4tcv4TG00kc6wE9zF"
