from django.conf.urls import url
from django.urls import re_path
from channels.routing import ChannelNameRouter, ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

from serv.consumers import serv_WebSocketConsumer

# Consumer Imports
from feedbacks.consumers import feedbacksConsumer
from sentiment_tests.consumers import sentiment_testsConsumer
from dashboard.consumers import dashboardConsumer


application = ProtocolTypeRouter({

    # WebSocket handler
    "websocket": AuthMiddlewareStack(
        URLRouter([
            re_path(r"ws/sentiment/(?P<channel_name>\w+)/$", sentiment_testsConsumer.as_asgi()),
        ])
    ),
    "channel": ChannelNameRouter({
        "feedbacks": feedbacksConsumer,    
        "sentiment_tests": sentiment_testsConsumer,    
        "dashboard": dashboardConsumer,
    })
})
