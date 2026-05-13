# from .base import *
# from decouple import config

# # Allowed hosts
# ALLOWED_HOSTS = ['*']  

# DEBUG = True
# SECRET_KEY = config('SECRET_KEY')

# # Database
# DATABASES = {
#     "default": {
#         "ENGINE": "django.db.backends.postgresql_psycopg2",
#         "NAME": config("DB_NAME"),
#         "USER": config("DB_USER"),
#         "PASSWORD": config("DB_PASSWORD"),
#         "HOST": config("DB_HOST"),
#         "PORT": config("DB_PORT"),
#         "OPTIONS": {
#             "sslmode": "require", 
#         },
#     }
# }
# CACHES = {
#     "default": {
#         "BACKEND": "django.core.cache.backends.dummy.DummyCache",
#     }
# }
# # SECURE_SSL_REDIRECT = True
# # SESSION_COOKIE_SECURE = True
# # CSRF_COOKIE_SECURE = True

# # Allow only your frontend origin
# # CORS_ALLOWED_ORIGINS = []
# CORS_ALLOW_ALL_ORIGINS = True

# # If you are sending cookies (JWT) from frontend
# CORS_ALLOW_CREDENTIALS = False

# CORS_ALLOW_HEADERS = [
#     "accept",
#     "accept-encoding",
#     "authorization",
#     "content-type",
#     "dnt",
#     "origin",
#     "user-agent",
#     "x-csrftoken",
#     "x-requested-with",
# ]
