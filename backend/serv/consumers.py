from channels.generic.websocket import WebsocketConsumer
from channels.consumer import SyncConsumer


class serv_WebSocketConsumer(WebsocketConsumer):

    def connect(self):
        self.channel_name = self.scope['url_route']['kwargs']['channel_name']
        self.accept()

    def receive(self, text_data=None, bytes_data=None):
        if text_data:
            print(f"Received text={text_data}")
            self.send(text_data="Hello from serv WebSocketConsumer!")
        if bytes_data:
            print(f"Received bytes={bytes_data}")
            self.send(bytes_data=b"Hello from serv WebSocketConsumer!")

    def disconnect(self, message):
        # Called when disconnected
        pass