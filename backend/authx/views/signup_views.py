from config.views import PublicApiView
from authx.serializers import SignUpSerailizer

class SignUpView(PublicApiView):
    serializer_class = SignUpSerailizer
    
    def post(self, request):
        try :
            serializer=SignUpSerailizer(data=request.data)

            if serializer.is_valid():
                serializer.save()
                
                return self.success(
                "User registered successfully.",
                serializer.data, 
                200
            )
            return self.error("Validation Errror.", serializer.errors,400)
        
        except Exception as e:
            return self.internal_server_error(str(e))