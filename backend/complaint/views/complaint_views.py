
from django.core.cache import cache
from rest_framework.response import Response
from config.views import BaseApiView, SuperAdminBaseApiView
from complaint.models import AetherixComplaints, ComplaintStatusChoices, ComplaintPriorityChoices
from config.utils import paginated_response
from complaint.services import forward_complaint_to_department
from complaint.serializers import ComplaintSerializer, ComplaintReadOnlySerializer
from authx.models import AetherixProfile, ProfileVerificationStatus, RoleChoices


class ComplaintListCreateApiViews(BaseApiView):

    def get(self, request):
        try:
            complaints = AetherixComplaints.objects.select_related(
                'user',
                'category',
                'category__department'
            ).filter(
                is_active=True,
            ).order_by('-priority_score')
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
            profile = AetherixProfile.objects.filter(user=request.user).first()
            if not profile:
                return self.error("Please complete your profile first.", status_code=403)

            if profile.verification_status != ProfileVerificationStatus.APPROVED:
                status_text = profile.verification_status or "Not Submitted"
                return self.error(f"Your profile is {status_text}. Only APPROVED profiles can submit complaints.", status_code=403)

            serializer = ComplaintSerializer(data=request.data, context={'request': request})
            
            if serializer.is_valid():
                serializer.save()
                cache.clear()
                return self.success("Complaint created successfully.")
            
            return self.error("Validation error.", errors=serializer.errors, status_code=400)
        
        except Exception as exe:
            return self.internal_server_error(str(exe))


class ComplaintsDetailApiView(BaseApiView):

    def get(self, request, reference_id):
        complaint = AetherixComplaints.objects.select_related(
            'user',
            'category',
            'category__department'
        ).filter(
            is_active=True,
            is_deleted=False,
            user=request.user,
            reference_id=reference_id
        ).first()
        if not complaint:
            return self.error("Complaint not found.", status_code=404)

        serializer = ComplaintReadOnlySerializer(complaint, context={'request': request})
        return self.success("Success", serializer.data)

    def put(self, request, reference_id):
        complaint = AetherixComplaints.objects.filter(
            is_active=True,
            is_deleted=False,
            user=request.user,
            reference_id=reference_id
        ).first()
        if not complaint:
            return self.error("Complaint not found.", status_code=404)

        serializer = ComplaintSerializer(complaint, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            updated_complaint = serializer.save()
            
            # FORCE PENDING when user updates (like profile logic)
            updated_complaint.status = ComplaintStatusChoices.PENDING
            updated_complaint.save(update_fields=['status'])
            
            cache.clear()
            return self.success("Complaint updated successfully. Status is now PENDING.", 
                              ComplaintReadOnlySerializer(updated_complaint).data)
        
        return self.error("Validation Error.", errors=serializer.errors, status_code=400)

    def delete(self, request, reference_id):
        complaint = AetherixComplaints.objects.filter(
            reference_id=reference_id,
            is_deleted=False,
            user=request.user
        ).first()
        if not complaint:
            return self.error("Complaint not found.", status_code=404)

        complaint.is_deleted = True
        complaint.save()
        cache.clear()
        return self.success("Complaint Deleted Successfully.")


class ComplaintsAdminUpdateApiView(SuperAdminBaseApiView):

    def get(self, request):
        complaints = AetherixComplaints.objects.filter(
            is_active=True,
            is_deleted=False
        ).select_related('user', 'category')
        
        serializer = ComplaintReadOnlySerializer(complaints, many=True, context={'request': request})
        return self.success("Success", serializer.data)

    def patch(self, request, reference_id):
        try:
            user= request.user
            if not (user.roles == RoleChoices.ADMIN or user.is_superuser):
                return self.error("Permission Denied.",403)
            
            # complaint = AetherixComplaints.objects.get(
            #     reference_id=reference_id,
            #     is_active=True,
            #     is_deleted=False
            # )
            complaint = AetherixComplaints.objects.select_related(
                'category', 'category__department'
            ).get(
                    reference_id=reference_id,
                    is_active=True,
                    is_deleted=False
            )
        except AetherixComplaints.DoesNotExist:
            return self.error("Complaint not found.", status_code=404)
 
        serializer = ComplaintSerializer(
            complaint, 
            data=request.data, 
            partial=True,
            context={'request': request}
        )

        if serializer.is_valid():
            updated_complaint = serializer.save()

            new_status = request.data.get('status')
            if new_status:
                status_upper = new_status.upper()
                if status_upper in [choice[0] for choice in ComplaintStatusChoices.choices]:
                    updated_complaint.status = status_upper
                    updated_complaint.save(update_fields=['status', 'is_verified'])

                    #forward to the linked department
                    forward_complaint_to_department(updated_complaint)
                else:
                    updated_complaint.save(update_fields=['status'])

            refreshed_serializer = ComplaintReadOnlySerializer(updated_complaint, context={'request': request})

            return self.success(
                message=f"Complaint status updated to {updated_complaint.status}",
                data=refreshed_serializer.data,
                status_code=200
            )

        return self.error("Validation failed", errors=serializer.errors, status_code=400)
    