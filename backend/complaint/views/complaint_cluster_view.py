from complaint.algorithms import cluster_complaints
from .complaint_views import AetherixComplaints
from config.views import BaseApiView

class ComplaintClusterView(BaseApiView):
    def get(self, request):
        complaints = AetherixComplaints.objects.filter(
            is_active=True,
            is_deleted=False,
            status="APPROVED"
        ).select_related('category')

        clustered_data = cluster_complaints(complaints, n_clusters=5)

        return self.success(
            message="Complaints clustered successfully",
            data=clustered_data
        )