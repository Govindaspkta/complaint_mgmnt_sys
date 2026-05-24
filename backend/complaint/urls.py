from django.urls import path
from complaint import views


urlpatterns  = [
    path("categories/", views.CategoryListCreateApiViews.as_view(), name ="category-list-create"),
    path("categories/<reference_id>", views.CategooryDetailApiView.as_view(), name ="category-detail"),

]