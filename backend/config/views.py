import logging
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from config.permission import IsSuperUser, isAdminRole, isUserRole

logger = logging.getLogger("django") 

class APIResponse:
    @staticmethod
    def success(message="Success", data=None, status_code=200):
        return Response({
            "success":True,
            "message":message,
            "data":data,
            "error":None
        }, status=status_code)
    
    @staticmethod
    def error(message="Error", errors=None, status_code=400):
        logger.error(f"{message} | Errors:{errors}", exc_info=True)
        return Response({
            "success":False,
            "message":message,
            "data":None,
            "error":errors,
        }, status=status_code)
    
    @staticmethod
    def internal_server_error(message='Internal Server Error', errors=None, status_code=500):
        logger.error(f"{message} | Errors:{errors}", exc_info=True)
        return Response({
            "success":False,
            "message":message,
            "data":None,
            "error":errors
        }, status=status_code)
    
    
class PublicApiView(APIView, APIResponse):

        authentication_classes=[]
        permission_classes=[]

class BaseApiView(APIView, APIResponse):
     
     authentication_classes=[JWTAuthentication]
     permission_classes=[IsAuthenticated]
    
class SuperAdminBaseApiView(APIView, APIResponse):
     authentication_classes =[JWTAuthentication]
     permission_classes = [IsSuperUser]

class AdminBaseApiView(APIView, APIResponse):
     authentication_classes= [JWTAuthentication]
     permission_classes = [IsAuthenticated, isAdminRole]


