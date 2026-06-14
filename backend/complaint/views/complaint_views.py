from config.views import BaseApiView, SuperAdminBaseApiView
from complaint.models import AetherixComplaints
from config.utils import paginated_response
from complaint.serializers import ComplaintSerializer, ComplaintReadOnlySerializer

class ComplaintListCreateApiViews(BaseApiView):

    def get(self, request):
        try:
            complaints = AetherixComplaints.objects.filter(is_active=True)
            return paginated_response(
                request=request,
                queryset=complaints,
                serializer_class=ComplaintReadOnlySerializer,
                message="Success"
            )
        except Exception as e:
         return self.internal_server_error(str(e))
        
    def post(self, request):
        try:
            serializer = ComplaintSerializer(
                data=request.data,
                context={'request':request})
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
    
    def put(self, request, reference_id):
        complaints = AetherixComplaints.objects.filter(
            is_active=True,
            is_deleted=False,
            refeerence_id=reference_id
        ).first()
        serializer = ComplaintSerializer(complaints, partial=True)
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
    
class ComplaintsAdminUpdateApiView(SuperAdminBaseApiView):

    def patch(self, request, reference_id):
        complaints = AetherixComplaints.objects.filter(
            is_active=True,
            is_deleted=False,
            reference_id=reference_id
        ).first()
        if complaints.status == "pending":
            serializer = ComplaintSerializer(complaints,data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                complaints.status = "approved"
                complaints.save()

            return self.success(
                message="Sucess",
                data=serializer.data,
                status_code=201
            )
        else:
            self.error(message="Only pedng complaints can be updated by the admin.")