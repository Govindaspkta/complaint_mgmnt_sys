from django.db.models import Q
from rest_framework import status

from config.views import BaseApiView, AdminBaseApiView
from config.utils import paginated_response

from complaint.models import Conversation, ChatMessage
from complaint.serializers.chat_serializer import (
    ConversationSerializer,
    ChatMessageSerializer,
)


class UserConversationApiView(BaseApiView):

    def get(self, request):
        try:
            conversation = Conversation.objects.filter(
                user=request.user
            ).first()

            if not conversation:
                return self.error(
                    "No conversation found.",
                    status_code=status.HTTP_404_NOT_FOUND
                )

            serializer = ConversationSerializer(conversation)

            return self.success(
                "Conversation retrieved successfully.",
                data=serializer.data
            )

        except Exception as exe:
            return self.internal_server_error(str(exe))

    def post(self, request):
        try:
            conversation, created = Conversation.objects.get_or_create(
                user=request.user
            )

            serializer = ConversationSerializer(conversation)

            message = (
                "Conversation created successfully."
                if created
                else "Conversation already exists."
            )

            return self.success(
                message,
                data=serializer.data,
                status_code=(
                    status.HTTP_201_CREATED
                    if created
                    else status.HTTP_200_OK
                )
            )

        except Exception as exe:
            return self.internal_server_error(str(exe))


class AdminConversationListApiView(AdminBaseApiView):

    def get(self, request):
        try:
            conversations = Conversation.objects.select_related(
                "user",
                "admin"
            ).order_by("-updated_at")

            response = paginated_response(
                request=request,
                queryset=conversations,
                serializer_class=ConversationSerializer,
                message="Conversations retrieved successfully."
            )

            return response

        except Exception as exe:
            return self.internal_server_error(str(exe))


class ConversationMessagesApiView(BaseApiView):

    def get(self, request, conversation_id):
        try:
            conversation = Conversation.objects.filter(
                Q(user=request.user) | Q(admin=request.user),
                id=conversation_id
            ).first()

            # Also allow other admins to access the support inbox.
            if (
                not conversation
                and request.user.roles == "ADMIN"
            ):
                conversation = Conversation.objects.filter(
                    id=conversation_id
                ).first()

            if not conversation:
                return self.error(
                    "Conversation not found or access denied.",
                    status_code=status.HTTP_404_NOT_FOUND
                )

            messages = ChatMessage.objects.filter(
                conversation=conversation
            ).select_related(
                "sender",
                "conversation"
            ).order_by("-created_at")

            return paginated_response(
                request=request,
                queryset=messages,
                serializer_class=ChatMessageSerializer,
                message="Messages retrieved successfully."
            )

        except Exception as exe:
            return self.internal_server_error(str(exe))