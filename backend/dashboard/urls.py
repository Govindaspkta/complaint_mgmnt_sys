from django.urls import path
from dashboard.views import AdminDashboardStatsApiView

urlpatterns = [
    path("stats/", AdminDashboardStatsApiView.as_view()),
]