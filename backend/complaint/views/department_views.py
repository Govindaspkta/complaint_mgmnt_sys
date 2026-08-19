from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from config.permission import IsSuperUser
from config.views import BaseApiView

from complaint.models import Department
from config.utils import paginated_response
from complaint.serializers import DepartmentSerializer

class DepartmentListCreateApiView(BaseApiView):

    def get_permission(self):
        if self.request.method == "POST":
            return [IsSuperUser()]
        return [IsAuthenticated()]

    def get(self, request):
        try:
            department = Department.objects.filter(is_active=True)
            return paginated_response(
                request=request,
                queryset=department,
                serializer_class=DepartmentSerializer,
                message="Success"
            )
        except Exception as e:
         return self.internal_server_error(str(e))
        
    def post(self, request):
        try:
            serializer = DepartmentSerializer(
                data=request.data,
                context={'request':request}
            )
            if serializer.is_valid():
                serializer.save()
                return self.success("department creaeted successfully.",status_code=200)
            
            return self.error(serializer.errors)
        
        except Exception as exe:
            return self.internal_server_error(str(exe))


class DepartmentDetailApiView(BaseApiView):

    def get(self, request, reference_id):

        department = Department.objects.filter(
            is_active=True,
            is_deleted=False,
            reference_id=reference_id
        ).first()
        if not department:
            return self.error("Deparment Not Found.", status_code=404)
        serializer = DepartmentSerializer(department)
        return self.success(
            message="Success",
            data=serializer.data,
            status_code=200
        )
    
    def put(self, request, reference_id):
        department = Department.objects.get(
            is_active=True,
            is_deleted=False,
            reference_id=reference_id
        )
            
        serializer = DepartmentSerializer(department,data=request.data, partial=True,)
        if serializer.is_valid():
            serializer.save()
            return self.success(
                "success",
                serializer.data,
                200
            )
        return self.error("Validation Error.")
    
    def delete(self, request, reference_id):
        department = Department.objects.filter(
            reference_id =reference_id,
            is_deleted=False,
        ).first()
        if not department:
            return self.error("Department Not Found", status_code=404)

        department.is_deleted =True
        department.save()
        return self.success(
            "Deaprtment Deleted Successfully."
            
        )