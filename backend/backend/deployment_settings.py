import os
import dj_database_url
from .settings import *
from .settings import BASE_DIR

ALLOWED_HOSTS = [os.environ.get("RENDER_EXTERNAL_HOSTNAME")]
CSRF_TRUSTED_ORIGINS = ["https://" + os.environ.get("RENDER_EXTERNAL_HOSTNAME")]

DEBUG = True
SECRET_KEY = os.environ.get("SECRET_KEY")

SITE_URL = os.environ.get("SITE_URL")
FRONTEND_SITE_URL = os.environ.get("FRONTEND_SITE_URL")

print("FRONTEND_SITE_URL", FRONTEND_SITE_URL)

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

CORS_ALLOWED_ORIGINS = [
    FRONTEND_SITE_URL,
]

print("CORS_ALLOWED_ORIGINS", CORS_ALLOWED_ORIGINS)

CSRF_TRUSTED_ORIGINS = [
    FRONTEND_SITE_URL,
]

CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True

RECAPTCHA_SECRET_KEY = os.environ.get("RECAPTCHA_SECRET_KEY")


MEDIA_ROOT = None
CLOUDINARY_STORAGE = {
    "CLOUD_NAME": os.environ.get("CLOUDINARY_CLOUD_NAME"),
    "API_KEY": os.environ.get("CLOUDINARY_API_KEY"),
    "API_SECRET": os.environ.get("CLOUDINARY_API_SECRET"),
}

STRIPE_PUBLISHABLE_KEY = os.environ.get("STRIPE_PUBLISHABLE_KEY")
STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY")


STORAGES = {
    # MEDIA FILES (Cloudinary)
    "default": {
        "BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage",
    },
    # STATIC FILES (WhiteNoise)
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

DATABASES = {
    "default": dj_database_url.config(
        default=os.environ["DATABASE_URL"], conn_max_age=600
    )
}
