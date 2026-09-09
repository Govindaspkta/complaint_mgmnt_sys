from django.contrib.auth import get_user_model
from authx.models import AetherixProfile, ProfileVerificationStatus
from complaint.models import AetherixComplaints, ComplaintCategory
from config.views import SuperAdminBaseApiView, BaseApiView

User = get_user_model()


class AdminDashboardStatsApiView(BaseApiView):

    def get(self, request):
        try:
            print("\n===== DASHBOARD DEBUG START =====")

            total_users = User.objects.count()
            total_profiles = AetherixProfile.objects.count()
            pending_profiles = AetherixProfile.objects.filter(
                verification_status=ProfileVerificationStatus.PENDING
            ).count()
            total_complaints = AetherixComplaints.objects.filter(
                is_deleted=False
            ).count()
            total_categories = ComplaintCategory.objects.count()

            # 🔍 Debug prints
            print("Total Users:", total_users)
            print("Total Profiles:", total_profiles)
            print("Pending Profiles:", pending_profiles)
            print("Total Complaints:", total_complaints)
            print("Total Categories:", total_categories)

            print("===== DASHBOARD DEBUG END =====\n")

            return self.success("Success", {
                "total_users": total_users,
                "pending_profiles": pending_profiles,
                "total_complaints": total_complaints,
                "total_categories": total_categories
            })

        except Exception as e:
            print("❌ Dashboard Error:", str(e))
            return self.internal_server_error(str(e))