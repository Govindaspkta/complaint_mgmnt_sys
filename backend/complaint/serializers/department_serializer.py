from rest_framework import serializers
from complaint.models import Department 


class DepartmentSerializer(serializers.Serializer):
    reference_id = serializers.CharField(
        read_only=True
    )
    name = serializers.CharField(
        required=True,
        error_messages={
            "required":"Department Name is required."
        }
    )
    display_name = serializers.CharField(
    required=True,
        error_messages={
            "required":"Department Name is required."
        }
    )

    description = serializers.CharField(required =False,allow_blank=True)
    email = serializers.EmailField(
        required=True,
        error_messages ={
            "required": "Email is required."
        }
    )
   

    def create(self, validated_data):
        return Department.objects.create(**validated_data)

    def update(self,instance, validated_data):
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()
        return instance