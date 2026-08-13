from rest_framework import serializers
import os
from complaint.models import AetherixComplaints, ComplaintCategory, ComplaintStatusChoices
from complaint.serializers import CategorySerializer


class DepartmentSerializer(serializers.Serializer):
    reference_id = serializers.CharField(
        read_only=True
    )
    name = serializers.CharField(
        required=True,
        error_messages={
            "required":"Category Name is required."
        }
    )
    display_name = serializers.CharField(
    required=True,
        error_messages={
            "required":"Category Name is required."
        }
    )

    description = serializers.CharField()

    def create(self, validated_data):
        return ComplaintCategory.objects.create(**validated_data)

    def update(self,instance, validated_data):
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()
        return instance