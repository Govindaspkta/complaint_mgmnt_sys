from config.views import BaseApiView, SuperAdminBaseApiView
from authx.serializers import ProfileCompletionSerializer, ProfileVerificationSerializer
from authx.models import AetherixProfile, ProfileVerificationStatus


class ProfileCompletion(BaseApiView):

    def post(self, request):
        profile = AetherixProfile.objects.filter(user=request.user).first()

        # Block approved profiles
        if profile and profile.verification_status == ProfileVerificationStatus.APPROVED:
            return self.error(
                message="Profile is already verified. Cannot Update.",
                status_code=403
            )

        # Serializer handles both Create and Update
        serializer = ProfileCompletionSerializer(
            profile,   # None if new user
            data=request.data,
            partial=True,
            context={'request': request}
        )

        if serializer.is_valid():
            updated_profile = serializer.save()

            # FORCE PENDING - This must run every time user submits/resubmits

            updated_profile.verification_status = ProfileVerificationStatus.PENDING
            updated_profile.save(update_fields=['verification_status'])

            refreshed_serializer = ProfileCompletionSerializer(
                updated_profile,
                context={"request": request}
            )

            return self.success(
                "Profile submitted successfully. Status is now PENDING.",
                data=refreshed_serializer.data
            )

        return self.internal_server_error("Validation Error.", errors=serializer.errors)
    
class ProfileCompletionDetailApiView(BaseApiView):

    def get(self,request):
         profile = AetherixProfile.objects.filter(
              user=request.user,
          
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
        profile = AetherixProfile.objects.filter(user=request.user).first()
        if not profile:
            return self.error("Profile not found.", status_code=404)

        if profile.verification_status == ProfileVerificationStatus.APPROVED:
            return self.error("Profile is already verified. Cannot Update.", status_code=403)

        if profile.verification_status == ProfileVerificationStatus.PENDING:
            return self.error("Your profile is under review.", status_code=403)

        serializer = ProfileCompletionSerializer(
            profile,
            data=request.data,
            partial=True,
            context={'request': request}
        )

        if serializer.is_valid():
            updated_profile = serializer.save()

            updated_profile.verification_status = ProfileVerificationStatus.PENDING
            updated_profile.save(update_fields=['verification_status'])

            refreshed_serializer = ProfileCompletionSerializer(
                updated_profile,
                context={"request": request}
            )

            return self.success(
                "Profile Updated Successfully. Status is now PENDING.",
                data=refreshed_serializer.data,
                status_code=200
            )

        return self.internal_server_error("Validation Error.", errors=serializer.errors)
    
class ProfileVerificationAdminAPiview(SuperAdminBaseApiView):
        

        def get(self, request):
            profiles =AetherixProfile.objects.filter(
                verification_status__in = [
                     ProfileVerificationStatus.PENDING,
                     ProfileVerificationStatus.REJECTED,
                     ProfileVerificationStatus.APPROVED,

                ]
                                       
             ).select_related('user')
            # profiles = AetherixProfile.objects.all().order_by('-id')
            
            serializer = ProfileCompletionSerializer(
                profiles,
                many=True,
                context={'request':request}
            )
            print("Total profiles found:", profiles.count())  # Check server logs
            print("Statuses:", [p.verification_status for p in profiles])
            return self.success(
                 "Success",
                 serializer.data,
                 200
            )
        
    
        def patch(self, request, reference_id):
            try:
                profile = AetherixProfile.objects.get(
                    reference_id=reference_id,
                    is_active=True
                )
            except AetherixProfile.DoesNotExist:
                return self.error("Profile not found", 404)

            serializer = ProfileVerificationSerializer(
                profile, 
                data=request.data, 
                partial=True
            )

            if serializer.is_valid():
                updated_profile = serializer.save()

                # Sync is_verified
                updated_profile.is_verified = (updated_profile.verification_status == ProfileVerificationStatus.APPROVED)
                updated_profile.save()

                refreshed_serializer = ProfileVerificationSerializer(
                    updated_profile, context={'request': request}
                )

                return self.success(
                    message="Profile updated successfully",
                    data=refreshed_serializer.data,
                    status_code=200
                )

            return self.internal_server_error("Validation failed", serializer.errors, 400)
            

