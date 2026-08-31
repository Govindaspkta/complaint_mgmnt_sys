"""
ASGI config for complaint_sys project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os
from  decouple import config


from django.core.asgi import get_asgi_application
mode = config('MODE')
if mode == 'development':   
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'complaint_sys.settings.development')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'complaint_sys.settings.production')


application = get_asgi_application()
