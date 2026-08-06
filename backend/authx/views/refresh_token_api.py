from rest_framework import status
from config.views import PublicApiView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken
from authx.models import AetherixUsers, UserSession

class RefreshTokenApiView(PublicApiView):

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        # print(request.COOKIES)
        if not refresh_token:
            return self.error(
                message="Refresh token missing.Please Try again.",
                status_code=status.HTTP_401_UNAUTHORIZED
            )
        try:
            old_refresh = RefreshToken(refresh_token)
            session = UserSession.objects.filter(
                user_id =old_refresh["user_id"],
                refresh_token=refresh_token,
                is_active=True,
            ).first()
            # user = AetherixUsers.objects.get(
            #     id=old_refresh["user_id"]
            # )
            if not session:
                return self.error(
                    message="Session Expired.",
                    status_code=status.HTTP_401_UNAUTHORIZED
                )
            old_refresh.blacklist()
            new_refresh = RefreshToken.for_user(session.user)

            session.refresh_token =str(new_refresh)
            session.save()
            access_token = str(new_refresh.access_token)
            
            response_data ={
                "access":access_token
            }
            response = self.success(
                message="Token refreshed successfully.",
                data=response_data,
                status_code=status.HTTP_200_OK
            )

            response.set_cookie(
                key='refresh_token',
                value=str(new_refresh),
                httponly=True, #only ofr dev
                secure=False,
                samesite='Lax',
                path='/',
                max_age=24*60*60
            )
            return response

        except(InvalidToken, TokenError):
            return self.error(
                message="Refresh token expired or invalid",
                status_code=status.HTTP_401_UNAUTHORIZED
            )
    
       