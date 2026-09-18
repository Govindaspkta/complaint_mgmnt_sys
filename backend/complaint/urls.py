from django.urls import path
from complaint import views


urlpatterns  = [
    #categories
    path("categories/", views.CategoryListCreateApiViews.as_view(), name ="category-list-create"),
    path("categories/<reference_id>", views.CategooryDetailApiView.as_view(), name ="category-detail"),

    #complaints
    path("clusters/", views.ComplaintClusterView.as_view(), name="complaint-clusters"),
    path("", views.ComplaintListCreateApiViews.as_view(), name ="complaints-list-create"),
    path("admin/", views.ComplaintsAdminUpdateApiView.as_view(), name ="complaint-by-admin"),
    path("admin/<reference_id>/", views.ComplaintsAdminUpdateApiView.as_view(), name ="complaint-by-admin"),
    path("departments/", views.DepartmentListCreateApiView.as_view(), name="departments"),
    path("departments/<str:reference_id>/", views.DepartmentDetailApiView.as_view(), name="depatments-details"),
    
    path("<reference_id>/", views.ComplaintsDetailApiView.as_view(), name ="complaints-detail"),
    path("<str:reference_id>/upvote/", views.AetherixUpvote.as_view(), name='upvote-complaint'),





]

