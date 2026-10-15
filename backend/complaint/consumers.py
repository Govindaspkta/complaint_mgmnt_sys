
import json

from channels.generic.websocket import AsyncWebsocketConsumer


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.accept()

        await self.send(text_data=json.dumps({
            "message": "WebSocket connected successfully!"
        }))

    async def disconnect(self, close_code):
        print("WebSocket disconnected:", close_code)

    async def receive(self, text_data):
        data = json.loads(text_data)

        await self.send(text_data=json.dumps({
            "message": "Message received",
            "received_data": data,
        }))
