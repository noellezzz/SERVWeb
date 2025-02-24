from django.urls import path
from .api import TextToSpeechView

urlpatterns = [
    path('tts/', TextToSpeechView.as_view(), name='text_to_speech'),
    path('tts/test', TextToSpeechView.as_view(), name='text_to_speech'),
    
]