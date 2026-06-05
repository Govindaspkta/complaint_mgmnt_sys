from rest_framework import serializers
from authx.models import AetherixUsers
# from config.global_validations validate_password

class SignUpSerailizer(serializers.Serializer):

    mobile_number = serializers.CharField(
        required =True,
        error_messages ={
            "required":"FIrst name cannot be blank."
        }
    )
    first_name = serializers.CharField(
        required=True,
        allow_blank=False,
        error_messages ={
            "required":"FIrst name cannot be blank."
        }
    )
    last_name = serializers.CharField(
        required=True,
        allow_blank=False,
        error_messages ={
            "required" :"Last Name cannot be blank."
        }
    )
    username = serializers.CharField(
        required=True,
        allow_blank=True,
        error_messages ={
            "required":"Username cannot be blank.",
            "blank":"Username cannot be blank."
        }
    )
    password = serializers.CharField(
        required=True,
        allow_blank=False,
        error_messages ={
            "required":"Password cannot be blank.",
            "blank":"Password cannot be blank."
        }
    )
    confirm_password = serializers.CharField(
        required=True,
        allow_blank=False,
        write_only=True,
        error_messages ={
            "required":"Password cannot be blank.",
            "blank":"Password cannot be blank."
        }
    )
    email = serializers.EmailField(
        required=False,
        allow_blank=False
    )

    def validate_username(self, username):
        query = AetherixUsers.objects.filter(username__iexact=username)
        if self.instance:
            query = query.exclude(id=self.instance.id)

        if query.exists():
            raise serializers.ValidationError("Username already exists.")
        
        return username
        
    def validate(self, data):
        if not self.instance:
            if data.get("password") != data.get("confirm_password"):
                raise serializers.ValidationError("Password and confirm password didnot match")
            data.pop("confirm_password")
        return data
        
    def create(self, validated_data):
        password = validated_data.pop("password")

        user = AetherixUsers.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user