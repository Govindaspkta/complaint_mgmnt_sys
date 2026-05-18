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
    pass

def create(self, validated_data):
    profile = AetherixProfile.objects.crate(**validated_data)
    profile.save()
    return profile

def update(self, instance, validated_data):
    for field,value in validated_data.items():
        setattr(instance, field, value)
        instance.save()
        return instance