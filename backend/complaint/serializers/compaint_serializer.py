from rest_framework import serializers
import os
from complaint.models import AetherixComplaints, ComplaintCategory

class ComplaintSerializer(serializers.Serializer):

    user = serializers.SlugRelatedField(
        read_only=True,
        # queryset = AetherixUsers.objects.all(),
        slug_field ="reference_id",
        )
    category = serializers.SlugRelatedField(
        queryset = ComplaintCategory.objects.all(),
            slug_field="reference_id",
            
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
            "required":"Province Name is required."
        }
    )
    district = serializers.CharField(
        required=True,
        error_messages={
            "required":"District  is required."
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
        required=False
    )
    
    def validate_image(self, value):
        max_size = 1*1024*1024
        if value.size > max_size:
            raise serializers.ValidationError("Image size cannot exceed 1 mb.")
        
        ext = os.path.splitext(value.name)[1].lower()
        valid_extensions = ['.jpg', ',jpeg', '.png']
        if ext not in valid_extensions:
            raise serializers.ValidationError("File Type not supported.")

        return value

    def create(self, validated_data):
        validated_data["user"] =self.context["request"].user
        return AetherixComplaints.objects.create(**validated_data)

    def update(self,instance, validated_data):
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()
        return instance
