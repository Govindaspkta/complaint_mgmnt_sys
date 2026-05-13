"""
WSGI config for complaint_sys project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os
from decouple import config
from django.core.wsgi import get_wsgi_application


mode = config('MODE')
if mode == 'development':

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'complaint_sys.settings.development')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'complaint_sys.settings.production')


application = get_wsgi_application()
