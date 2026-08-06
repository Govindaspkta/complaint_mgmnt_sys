from django.contrib.auth import authenticate
# from drf_spectacular.utils import extend_schema
from config.views import PublicApiView
# from config.standard_serializer import StandardResponseSerializer
from authx.serializers import LoginSerializer
from authx.models import UserSession
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

class LoginAPIView(PublicApiView):
    
    # @extend_schema(
    #         request=LoginSerializer,
    #         responses ={200:StandardResponseSerializer},
    #         description = "custom er Login Endpoint returning JWT Tokens.")
    
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return self.error(
                message="Validation Failed.",
                errors= serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )
        credentials = serializer.validated_data
        user = authenticate(request=request, **credentials)
        
        if not user:
            return self.error(
                message="Invalid Credentials", 
                status_code=status.HTTP_401_UNAUTHORIZED
            )
        refresh = RefreshToken.for_user(user)
        
        UserSession.objects.create(
            user=user,
            refresh_token=str(refresh),
            ip_address =request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT')
        )
        response_data ={
            "access" : str(refresh.access_token),
            "user":{
                "id":user.id,
                "username":user.username,
                "email":user.email,
                "reference_id":user.reference_id,
                "is_staff":user.is_staff
            }
        }
        response = self.success(
            data=response_data,
            message="Login Successful",
            status_code = status.HTTP_200_OK
        )
        response.set_cookie(
            key ='refresh_token',
            value= str(refresh),
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=24*60*60
        )
        return response