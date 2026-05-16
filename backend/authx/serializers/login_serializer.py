from rest_framework import serializers

class LoginSerializer(serializers.Serializer):

    username = serializers.CharField(
        required=True,
        allow_blank=False,
        allow_null=False,
        error_messages ={
            "required":"user name cannot be blank."
        }
    )
    password = serializers.CharField(
        required=True,
        allow_blank=True,
        allow_null=False,
        error_messages ={
            "required":"Password cannot be blank.",
            "blank":"Password cannot be blank."
        }
    )

    