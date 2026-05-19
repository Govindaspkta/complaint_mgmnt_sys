from rest_framework import serializers
from authx.models import AetherixProfile

class ProfileCompletionSerializer(serializers.Serializer):

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

    def validate(self, data):
        user = self.context["request"].user
        if AetherixProfile.objects.filter(user=user).exists():
            raise serializers.ValidationError(
                "Profile Already Exists."
                
            )
        return data
        

    def create(self, validated_data):
        user = self.context["request"].user
        profile = AetherixProfile.objects.create(
            user=user,
            **validated_data
        )
        profile.save()
        return profile

    def update(self, instance, validated_data):
        for field,value in validated_data.items():
            setattr(instance, field, value)
        instance.save()
        
        return instance