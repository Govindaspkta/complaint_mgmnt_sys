from config.views import BaseApiView
from authx.serializers import ProfileCompletionSerializer
from authx.models import AetherixProfile

class ProfileCompletion(BaseApiView):

    def post(self, request):
        profile= AetherixProfile.objects.filter(
            user=request.user
        ).first()
        if profile and profile.is_verified:
            if profile.is_verified:
                return self.error(
                    message="Profile is already verified. Cannot Update.",
                    status_code=403
                )
            serializer = ProfileCompletionSerializer(
                 profile,
                 data=request.data,
                 partial=True,
                 context={'request':request}
            )
        else:
            serializer = ProfileCompletionSerializer(
                data=request.data,
                context={'request':request},
                partial=True
            )
        if serializer.is_valid():
                serializer.save()
                return self.success(
                    "Profile Updated Successfully.",
                    data=serializer.data
                )
        return self.internal_server_error("Validation Error.", errors=serializer.errors)
        
    # def patch(self, request):
    #     profile, created = AetherixProfile.objects.get_or_create(
    #         user=request.user
    #     )
    #     if profile:
    #         if profile.is_verified:
    #             return self.error(
    #                 message="Profile is already verified. Cannot Update.",
    #                 status_code=403
    #             )
    #         serializer = ProfileCompletionSerializer(
    #              profile,
    #              data=request.data,
    #              partial=True,
    #              context={'request':request}
    #         )
    #     else:
    #         serializer = ProfileCompletionSerializer(
    #             data=request.data,
    #             context={'request':request}
    #         )
    #     if serializer.is_valid():
    #             serializer.save()
    #             return self.success(
    #                 "Profile Updated Successfully.",
    #                 data=serializer.data
    #             )
    #     return self.internal_server_error("Validation Error.", errors=serializer.errors)
