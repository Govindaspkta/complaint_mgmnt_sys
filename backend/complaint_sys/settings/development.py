from .base import *
from decouple import config
# 
ALLOWED_HOSTS = ['*']

CORS_ORIGIN_ALLOW_ALL=True
CORS_ALLOW_CREDENTIALS =True

SECRET_KEY = config('SECRET_KEY')
DEBUG =True

# DEBUG = config('DEBUG')

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
