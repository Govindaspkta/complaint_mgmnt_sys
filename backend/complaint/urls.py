from django.urls import path
from complaint import views


urlpatterns  = [
    #categories
    path("categories/", views.CategoryListCreateApiViews.as_view(), name ="category-list-create"),
    path("categories/<reference_id>", views.CategooryDetailApiView.as_view(), name ="category-detail"),

    #complaints
    path("", views.ComplaintListCreateApiViews.as_view(), name ="complaints-list-create"),
    path("<reference_id>", views.ComplaintsDetailApiView.as_view(), name ="complaints-detail"),


]