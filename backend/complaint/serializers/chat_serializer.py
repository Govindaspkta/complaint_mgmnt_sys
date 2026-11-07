from rest_framework import serializers
from complaint.models import Conversation, ChatMessage


class ConversationSerializer(serializers.ModelSerializer):

    user_username = serializers.CharField(
        source="user.username",
        read_only=True
    )

    admin_username = serializers.CharField(
        source="admin.username",
        read_only=True,
        allow_null=True
    )

    class Meta:
        model = Conversation
        fields = [
            "id",
            "user",
            "user_username",
            "admin",
            "admin_username",
            "created_at",
            "updated_at",
        ]
        read_only_fields = fields


class ChatMessageSerializer(serializers.ModelSerializer):

    sender_username = serializers.CharField(
        source="sender.username",
        read_only=True
    )

    class Meta:
        model = ChatMessage
        fields = [
            "id",
            "conversation",
            "sender",
            "sender_username",
            "message",
            "is_read",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "conversation",
            "sender",
            "sender_username",
            "is_read",
            "created_at",
        ]