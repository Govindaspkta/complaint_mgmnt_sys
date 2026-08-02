from rest_framework.response import Response
from ..models import AetherixComplaints, ComplaintUpvote
from config.views import BaseApiView
from config.utils import paginated_response
from complaint.algorithms import calculate_priority_score

class AetherixUpvote(BaseApiView):

    def post(self, request, reference_id):
        try:
            complaint = AetherixComplaints.objects.get(reference_id=reference_id)
        except AetherixComplaints.DoesNotExist:
            return self.error("Complaint not found", status=404)

        #cehck if already upvoted
        upvote = ComplaintUpvote.objects.filter(
            complaint=complaint,
            user=request.user
        ).first()
        if upvote:
            upvote.delete()
            action = "removed"
        else:
            ComplaintUpvote.objects.create(
                complaint=complaint,
                user=request.user
            )
            action = "upvoted"
            
        complaint.upvotes_count= complaint.upvotes.count()
        complaint.priority_score = calculate_priority_score(complaint)
        complaint.save()

        return self.success(
                message = f"Upvote {action} successfully.",
                data ={
                    "upvotes_count": complaint.upvotes_count,
                    "has_upvoted":action =="upvoted"
            })