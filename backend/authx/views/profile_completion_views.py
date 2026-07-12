from config.views import BaseApiView, SuperAdminBaseApiView
from authx.serializers import ProfileCompletionSerializer
from authx.models import AetherixProfile, ProfileVerificationStatus


class ProfileCompletion(BaseApiView):

    def post(self, request):
        profile= AetherixProfile.objects.filter(
            user=request.user
        ).first()
        if profile:
            if  profile.verification_status == ProfileVerificationStatus.APPROVED:
                return self.error(
                    message="Profile is already verified. Cannot Update.",
                    status_code=403
                )
            elif profile.verification_status == ProfileVerificationStatus.PENDING:
                 return self.error(
                    message="Profile is pending wait for the response.",
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

    def get(self,request):
         profile = AetherixProfile.objects.filter(
              user=request.user,
            #   reference_id=reference_id,
            #   is_active=True,
         ).first()
         serializer = ProfileCompletionSerializer(
              profile,
              context={"request":request}
              )
         return self.success(
              message="User Profile",
            data=serializer.data,
            status_code=200,
         )
    
    def patch(self, request):
            profile = AetherixProfile.objects.filter(
                user=request.user,
            ).first()
            if profile:
                if profile.verification_status == ProfileVerificationStatus.APPROVED:
                    return self.error(
                        message="Profile is already verified. Cannot Update.",
                        status_code=403
                    )
                if profile.verification_status == ProfileVerificationStatus.PENDING:
                    return self.error(
                        message="Your profile is under review.",
                        status_code=403
                    )
                serializer = ProfileCompletionSerializer(
                    profile,
                    data=request.data,
                    partial=True,
                    context={'request':request}
                )
            else:
                 return self.error(
                      message="Profile not found.",
                      status_code=404
                 )
          
            if serializer.is_valid():
                    serializer.save()
                    return self.success(
                        "Profile Updated Successfully.",
                        data=serializer.data,
                        status_code = 200
                    )
            return self.internal_server_error("Validation Error.", errors=serializer.errors)

    
class ProfileVerificationAdminAPiview(SuperAdminBaseApiView):
        

        def get(self, request):
            profile =AetherixProfile.objects.filter(
                verification_status = ProfileVerificationStatus.PENDING
             ).select_related('user')
            
            serializer = ProfileCompletionSerializer(
                profile,
                many=True,
                context={'request':request}
            )
            return self.success(
                 "Success",
                 serializer.data,
                 200
            )
        def patch(self, request, reference_id):
             try:
                profile = AetherixProfile.objects.get(
                    reference_id =reference_id,
                    is_active=True,
                )
                if profile and profile.is_verified is False:
                    
                    serializer = ProfileCompletionSerializer(profile, data=request.data, partial=True)
                    if serializer.is_valid():
                        serializer.save()
                        profile.is_verified = True
                        profile.save()
                        if profile.verification_status == ProfileVerificationStatus.APPROVED:
                            profile.is_verified = True

                        elif profile.verification_status == ProfileVerificationStatus.REJECTED:
                            profile.is_verified = False

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
             except Exception as exe:
                  return self.internal_server_error(
                       "validation failed.",
                       serializer.errors,
                       400
                  )
        

