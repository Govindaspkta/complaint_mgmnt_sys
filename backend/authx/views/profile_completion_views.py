
from config.views import BaseApiView
from authx.serializers import ProfileCompletionSerializer
from authx.models import AetherixProfile

class ProfileCompletion(BaseApiView):

    # def post(self, request):
    #     serializer = ProfileCompletionSerializer(data =request.data)
    #     if not serializer.is_valid():
    #         return self.error(
    #             message="Validation Error",
    #             errors=serializer.errors,
    #             status_code=400
    #         )
    def patch(self, request):
        profile, created = AetherixProfile.objects.get_or_create(
            user=request.user
        )
        serializer = ProfileCompletionSerializer(
            profile,
            data=request.data,
            partial=True,
            context={'request':request}
        )
        if serializer.is_valid():
            serializer.save()
            return self.success(
                "Profile Updated Successfully.",
                 data=serializer.data
            )
        return self.internal_server_error("Validation Error.")
