from rest_framework import status
from config.views import BaseApiView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import RefreshToken

class RefreshTokenApiView(BaseApiView):
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return self.error(
                message="Refresh token missing.Please Try again.",
                status_code=status.HTTP_401_UNAUTHORIZED
            )
        try:
            refresh = RefreshToken(refresh_token)
        except(InvalidToken, TokenError):
            return self.error(
                message="Refresh token expired or invalid",
                status_code=status.HTTP_401_UNAUTHORIZED

            )
        
        #issuing new accesss token
        response_data={
            "access":str(refresh.access_token),
            #rotating refresh token extra secure
            "refresh":str(refresh)
        }
        response = self.success(
            message="Token refreshed successfully.",
            data=response_data,
            status_code=status.HTTP_200K_OK
        )

        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            httponly=True, #only ofr dev
            secure=False,
            samesite='Lax',
            max_age=24*60*60
        )
        return response