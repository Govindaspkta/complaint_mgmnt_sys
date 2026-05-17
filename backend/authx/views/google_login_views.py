import os
import logging
from django.contrib.auth import get_user_model

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status

from authx.models import *
from authx.serializers import *
from config.views import PublicApiView
from google.oauth2 import id_token
from google.auth.transport import requests


logger = logging.getLogger(__name__)

# user = get_user_model()
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")

class GoogleLoginAPIView(PublicApiView):
    def post(self, request):
        serializer = GoogleLoginSerializer(data=request.data)
        if not serializer.is_valid():
            return self.error(
                message="Validation Error.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )
        token = serializer.validated_data.get("token")
        try:
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                GOOGLE_CLIENT_ID
            )
            
        except ValueError:
            return self.error( 
                message="Invalid Google Token",
                status_code=status.HTTP_400_BAD_REQUEST
            )
        email = idinfo.get("email")
        name = idinfo.get("name")


        user, created = AetherixUsers.objects.get_or_create(
            email=email,
            defaults={
                "email":email,
                "username":name,
                }
        )
        refresh = RefreshToken.for_user(user)

        response_data = { 
            "access":str(refresh.access_token),
            "user":{
                "id":user.id,
                "email":user.email,
                "username":user.username
            }
        }
        response = self.success(
            data=response_data,
            message ="Google Login Successful",
            status_code =status.HTTP_200_OK
        )
        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=24*60*60
        )
        return response