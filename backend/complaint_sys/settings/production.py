from .base import *
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent.parent
STATIC_ROOT = BASE_DIR / 'staticfiles'  # recompute after BASE_DIR fix

DEBUG = False
SECRET_KEY = config('SECRET_KEY')

ALLOWED_HOSTS = [h.strip() for h in config('ALLOWED_HOSTS', default='').split(',') if h.strip()]
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': config("DB_NAME"),
        'USER': config("DB_USER"),
        'PASSWORD': config("DB_PASSWORD"),
        'HOST': config("DB_HOST"),
        'PORT': config("DB_PORT"),
    }
}

CORS_ORIGIN_ALLOW_ALL = False
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='').split(',')

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# Caching — plain in-memory for now, add Redis later
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}

# Security hardening
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True


CLOUDINARY_STORAGE = {
    'CLOUD_NAME': config('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': config('CLOUDINARY_API_KEY'),
    'API_SECRET': config('CLOUDINARY_API_SECRET'),
}
# production.py
# STORAGES = {
#     "default": {
#         "BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage",
#     },
#     "staticfiles": {
#         "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
#     },
# }


# # django-cloudinary-storage's collectstatic override still checks this
# # legacy attribute directly — Django 6.0 no longer auto-populates it from
# # STORAGES, so we set it explicitly to keep that package working.
# STATICFILES_STORAGE = STORAGES["staticfiles"]["BACKEND"]
# WHITENOISE_MANIFEST_STRICT = False