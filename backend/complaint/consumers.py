
# import json

# from channels.generic.websocket import AsyncWebsocketConsumer


# class ChatConsumer(AsyncWebsocketConsumer):

#     async def connect(self):
#         await self.accept()

#         await self.send(text_data=json.dumps({
#             "message": "WebSocket connected successfully!"
#         }))

#     async def disconnect(self, close_code):
#         print("WebSocket disconnected:", close_code)

#     async def receive(self, text_data):
#         data = json.loads(text_data)

#         await self.send(text_data=json.dumps({
#             "message": "Message received",
#             "received_data": data,
#         }))



import json
from channels.generic.websocket import AsyncWebsocketConsumer


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_group_name = "test_chat_room"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        await self.send(text_data=json.dumps({
            "type": "connection",
            "message": "Connected to chat room!"
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)

        message = data.get("message")

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "type": "chat_message",
            "message": event["message"],
        }))
