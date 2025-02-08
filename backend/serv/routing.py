from django.conf.urls import url

from channels.routing import ChannelNameRouter, ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

from serv.consumers import serv_WebSocketConsumer

# Consumer Imports
from face_recognition.consumers import face_recognitionConsumer
from feedbacks.consumers import feedbacksConsumer
from queues.consumers import queuesConsumer
from sentiment_tests.consumers import sentiment_testsConsumer
from dashboard.consumers import dashboardConsumer


application = ProtocolTypeRouter({

    # WebSocket handler
    "websocket": AuthMiddlewareStack(
        URLRouter([
            url(r"^ws/$", serv_WebSocketConsumer.as_asgi()),
        ])
    ),
    "channel": ChannelNameRouter({
        "face_recognition": face_recognitionConsumer,    
        "feedbacks": feedbacksConsumer,    
        "queues": queuesConsumer,    
        "sentiment_tests": sentiment_testsConsumer,    
        "dashboard": dashboardConsumer,
    })
})
