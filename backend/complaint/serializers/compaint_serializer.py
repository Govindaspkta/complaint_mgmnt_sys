from rest_framework import serializers
import os
from complaint.models import AetherixComplaints, ComplaintCategory
from authx.models import AetherixUsers

class ComplaintSerializer(serializers.Serializer):
    user = serializers.SlugRelatedField(
        queryset = AetherixUsers.objects.all(),
        slug_field ="reference_id",
        required =True,
        
    )
    category = serializers.SlugRelatedField(
        queryset = ComplaintCategory.objects.all(
            slug_field="reference_id",
            required=True
        )
    )
    title = serializers.CharField(
        required=True,
        error_messages={
            "required":"Title is required."
        }
    )
    province = serializers.CharField(
    required=True,
        error_messages={
            "required":"province Name is required."
        }
    )
    district = serializers.CharField(
        required=True,
        error_messages={
            "required":"Province Name is required."
        }
    )
    municipality = serializers.CharField(
        required=True,
        error_messages={
            "required":"Municipality Name is required."
        }
    )
    ward = serializers.CharField(
        required=True,
        error_messages={
            "required":"Ward Number is required."
        }
    )

    description = serializers.CharField(required=True)
    image = serializers.ImageField()
    priority = serializers.CharField(
        required=True
    )
    priority = serializers.CharField(
        required=True
    )
    status = serializers.CharField(
        required=True
    )
    
    def validate_image(self, value):
        max_size = 1*1024*1024
        if value.size > max_size:
            raise serializers.ValidationError("Image size cannot exceed 1 mb.")
        
        ext = os.path.splittext(value.name)[1].lower()
        valid_extensions = ['.jpg', ',jpeg', '.png']
        if ext not in valid_extensions:
            raise serializers.ValidationError("File Type not supported.")

        return value

    def create(self, validated_data):
        return AetherixComplaints.objects.create(**validated_data)

    def update(self,instance, validated_data):
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()
        return instance
