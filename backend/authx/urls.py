from django.urls import path
from authx import views


urlpatterns  = [
    path("register/", views.SignUpView.as_view(), name ="register"),
    path("login/",views.LoginAPIView.as_view(),name="login"),
    path("google-login/",views.GoogleLoginAPIView.as_view(),name="google-login"),
    path("profile-completion/",views.ProfileCompletion.as_view(),name="profile-completion"),

]