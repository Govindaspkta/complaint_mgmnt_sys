from django.urls import path
from authx import views


urlpatterns  = [
    path("register/", views.SignUpView.as_view(), name ="register"),
    path("login/",views.LoginAPIView.as_view(),name="login"),
    path("google-login/",views.GoogleLoginAPIView.as_view(),name="google-login"),
    path("refresh/",views.RefreshTokenApiView.as_view(),name="refresh-token"),
    path("profile-completion/",views.ProfileCompletion.as_view(),name="profile-completion"),
    path("profile-completion/details/",views.ProfileCompletionDetailApiView.as_view(),name="profile-completion-details"),
    path("profile-verification/<reference_id>/",views.ProfileVerificationAdminAPiview.as_view(),name="profile-verification"),


]