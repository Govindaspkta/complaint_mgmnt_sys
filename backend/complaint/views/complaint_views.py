from config.views import BaseApiView
from complaint.models import AetherixComplaints
from config.utils import paginated_response
from complaint.serializers import ComplaintSerializer
class ComplaintListCreateApiViews(BaseApiView):

    def get(self, request):
        try:
            complaints = AetherixComplaints.objects.filter(is_active=True)
            return paginated_response(
                request=request,
                queryset=complaints,
                serializer_class=ComplaintSerializer,
                message="Success"
            )
        except Exception as e:
         return self.internal_server_error(str(e))
        
    def post(self, request):
        try:
            serializer = ComplaintSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return self.success("Complaint creaeted successfully.")
            
            return self.error(message="validation error.", errors=serializer.errors, status_code=400)
        
        except Exception as exe:
            return self.internal_server_error(str(exe))

class ComplaintsDetailApiView(BaseApiView):

    def get(self, request, reference_id):
        complaints = AetherixComplaints.objects.filter(
            is_active=True,
            is_deleted=False,
            reference_id=reference_id
        )
        serializer = ComplaintSerializer(complaints)
        return self.success(
            message="Success",
            data=serializer.data,
            status_code=200
        )
    
    def put(self, request, refeerence_id):
        complaints = AetherixComplaints.objects.filter(
            is_actie=True,
            is_delete=False,
            refeerence_id=refeerence_id
        )
        serializer = ComplaintSerializer(complaints)
        if serializer.is_valid():
            serializer.save()
            return self.success(
                "success",
                serializer.data,
                201
            )
        return self.error("Validation Error.")
    
    def delete(self, request, reference_id):
        complaints = AetherixComplaints.objects.filter(
            reference_id =reference_id,
            is_deleted=False,
        )
        complaints.is_deleted =True
        complaints.save()
        return self.success(
            "Complaint Deleted Successfully."
            
        )