from config.views import BaseApiView, SuperAdminBaseApiView
from authx.serializers import ProfileCompletionSerializer
from authx.models import AetherixProfile

class ProfileCompletion(BaseApiView):

    def post(self, request):
        profile= AetherixProfile.objects.filter(
            user=request.user
        ).first()
        if profile:
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
    
class ProfileCompletionDetailApiView(BaseApiView):

    def get(self,request, reference_id):
         profile = AetherixProfile.objects.filter(
              user=request.user,
              reference_id=reference_id,
            #   is_active=True,
         ).first()
         serializer = ProfileCompletionSerializer(profile)
         return self.success(
              message="User Profile",
            data=serializer.data,
            status_code=200,
         )
    
    def patch(self, request):
            profile, created = AetherixProfile.objects.get_or_create(
                user=request.user
            )
            if profile:
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
                    context={'request':request}
                )
            if serializer.is_valid():
                    serializer.save()
                    return self.success(
                        "Profile Updated Successfully.",
                        data=serializer.data
                    )
            return self.internal_server_error("Validation Error.", errors=serializer.errors)

    
    class ProfileVerificationAdminAPiview(SuperAdminBaseApiView):

        def patch(self, request, reference_id):
             profile = AetherixProfile.objects.get(
                  reference_id =reference_id,
                  is_active=True,
             )
             if profile and profile.is_verified is False:
                
                  serializer = ProfileCompletionSerializer(profile, data=request.data, partial=True)
                  if serializer.is_valid():
                       serializer.save()
                       profile.is_verified == True
                       profile.save()

                       return self.success(
                            message="success",
                            data=serializer.data,
                            status_code=201
                       )
                  return self.internal_server_error(
                       "internal server error",
                       serializer.error,
                       500

                  )
        
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
        #             profile,
        #             data=request.data,
        #             partial=True,
        #             context={'request':request}
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
