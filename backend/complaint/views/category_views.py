from config.views import SuperAdminBaseApiView
from complaint.models import ComplaintCategory
from config.utils import paginated_response
from complaint.serializers import CategorySerializer

class CategoryListCreateApiViews(SuperAdminBaseApiView):
    def get(self, request):
        try:
            category = ComplaintCategory.objects.filter(is_active=True)
            return paginated_response(
                request=request,
                queryset=category,
                serializer_class=CategorySerializer,
                message="Success"
            )
        except Exception as e:
         return self.internal_server_error(str(e))
        
    def post(self, request):
        try:
            serializer = CategorySerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return self.success("Category creaeted successfully.")
            
            return self.error("validation error.")
        
        except Exception as exe:
            return self.internal_server_error(str(exe))

class CategooryDetailApiView(SuperAdminBaseApiView):

    def get(self, request, reference_id):
        category = ComplaintCategory.objects.filter(
            is_active=True,
            is_deleted=False,
            reference_id=reference_id
        )
        serializer = CategorySerializer(category)
        return self.success(
            message="Success",
            data=serializer.data,
            status_code=200
        )
    
    def put(self, request, refeerence_id):
        category = ComplaintCategory.objects.filter(
            is_actie=True,
            is_delete=False,
            refeerence_id=refeerence_id
        )
        serializer = CategorySerializer(category)
        if serializer.is_valid():
            serializer.save()
            return self.success(
                "success",
                serializer.data,
                201
            )
        return self.error("Validation Error.")
    
    def delete(self, request, reference_id):
        category = ComplaintCategory.objects.filter(
            reference_id =reference_id,
            is_deleted=False,
        )
        category.is_deleted =True
        category.save()
        return self.success(
            "Catgory Deleted Successfully."
            
        )