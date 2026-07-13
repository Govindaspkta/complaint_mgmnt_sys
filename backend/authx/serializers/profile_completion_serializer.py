from rest_framework import serializers
from authx.models import AetherixProfile, ProfileVerificationStatus

class ProfileCompletionSerializer(serializers.Serializer):
    reference_id = serializers.CharField(read_only=True)

    citizenship_number = serializers.CharField(
        required=True
    )
    address = serializers.CharField(
        required =True,
    )
    citizenship_front = serializers.ImageField(
        required=True
    )
    citizenship_back = serializers.ImageField(
        required=True
    )
    dob = serializers.DateField(
        required =True
    )
    profile_picture = serializers.ImageField(required=True)
    verification_status = serializers.CharField(read_only=True)
    is_verified = serializers.BooleanField(read_only=True)

    def validate(self, data):
        return data
        # user = self.context["request"].user
        # if AetherixProfile.objects.filter(user=user).exists():
        #     raise serializers.ValidationError(
        #         "Profile Already Exists."
                
        #     )
        # return data
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        request = self.context.get('request')
        if request:
            if instance.profile_picture:
                representation['profile_picture'] = request.build_absolute_uri(instance.profile_picture.url)
            if instance.citizenship_front:
                representation['citizenship_front'] = request.build_absolute_uri(instance.citizenship_front.url)
            if instance.citizenship_back:
                representation['citizenship_back'] = request.build_absolute_uri(instance.citizenship_back.url)
        
        return representation
    
    def create(self, validated_data):
        user = self.context["request"].user
        return AetherixProfile.objects.create(
            user=user,
            **validated_data
        )

    def update(self, instance, validated_data):
        for field,value in validated_data.items():
            setattr(instance, field, value)
        instance.save()
        
        return instance
    
class ProfileVerificationSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = AetherixProfile
        fields = [
            'reference_id', 'user', 'citizenship_number', 'address', 'dob',
            'profile_picture', 'citizenship_front', 'citizenship_back',
            'verification_status', 'rejection_reason', 'is_verified'
        ]
        read_only_fields = ['reference_id', 'user', 'citizenship_number', 
                           'address', 'dob', 'profile_picture', 
                           'citizenship_front', 'citizenship_back', 'is_verified']
    
    def get_user(self, obj):
        return {
            'username': obj.user.username if obj.user else None,
            'email': obj.user.email if obj.user else None,
        }

# class ProfileVerificationSerializer(serializers.Serializer):
#     reference_id = serializers.CharField(read_only=True)
#     citizenship_number = serializers.CharField(read_only=True)
#     address = serializers.CharField(read_only=True)
#     citizenship_front = serializers.ImageField(read_only=True)
#     citizenship_back = serializers.ImageField(read_only=True)
#     dob = serializers.DateField(read_only=True)
#     profile_picture = serializers.ImageField(read_only=True)

#     verification_status = serializers.ChoiceField(
#         choices=ProfileVerificationStatus.choices
#     )

#     rejection_reason = serializers.CharField(
#         required=False,
#         allow_blank=True
#     )

#     is_verified = serializers.BooleanField(read_only=True)