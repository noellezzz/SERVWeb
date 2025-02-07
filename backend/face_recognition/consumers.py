from channels.generic.websocket import AsyncWebsocketConsumer
import json

class FaceRecognitionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("face_recognition", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("face_recognition", self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        # Process the data and send updates to the group
        await self.channel_layer.group_send(
            "face_recognition",
            {
                "type": "face_recognition_message",
                "message": data,
            }
        )

    async def face_recognition_message(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps(message))