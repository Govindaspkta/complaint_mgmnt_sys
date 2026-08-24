from rest_framework import serializers
from complaint.models import ComplaintCategory, Department

class CategorySerializer(serializers.Serializer):
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
    department = serializers.SlugRelatedField(
        slug_field="reference_id",
        queryset=Department.objects.filter(is_active=True, is_deleted=False),
        required=False,
        allow_null=True
    )

    description = serializers.CharField()

    def create(self, validated_data):
        return ComplaintCategory.objects.create(**validated_data)

    def update(self,instance, validated_data):
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()
        return instance



class CategorySerializer(serializers.Serializer):
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
    department = serializers.SlugRelatedField(
        slug_field="reference_id",
        queryset=Department.objects.filter(is_active=True, is_deleted=False),
        required=False,
        allow_null=True
    )

    description = serializers.CharField()

    def create(self, validated_data):
        return ComplaintCategory.objects.create(**validated_data)

    def update(self,instance, validated_data):
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()
        return instance
