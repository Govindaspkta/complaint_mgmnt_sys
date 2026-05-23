from config.views import SuperAdminBaseApiView
from complaint.models import ComplaintCategory
from config.pagination import paginated_response

class CategoryViews():
    def get(self, request):
        queryset = ComplaintCategory.objects.filter(is_active=True)
        return paginated_response()