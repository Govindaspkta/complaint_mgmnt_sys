from django.urls import path
from authx import views


urlpatterns  = [
    path("register/", views.SignUpView.as_view(), name ="register")

]