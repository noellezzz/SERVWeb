from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import StreamingHttpResponse
import io
import asyncio
import edge_tts
from asgiref.sync import async_to_sync

# https://gist.github.com/BettyJJ/17cbaa1de96235a7f5773b8690a20462
TAGALOG_VOICES = [
    'fil-PH-AngeloNeural',
    'fil-PH-BlessicaNeural'
]

class TextToSpeechView(APIView):
    async def generate_audio(self, text, voice):
        communicate = edge_tts.Communicate(text, voice)
        audio_stream = io.BytesIO()
        
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_stream.write(chunk["data"])
        
        audio_stream.seek(0)
        return audio_stream

    def get(self, request, *args, **kwargs):
        text = request.GET.get('text', 'Magandang umaga sayo kapatid. Ito ay isang mahabang talata sa Tagalog na ginagamit upang subukan ang text-to-speech functionality ng aming system. Ang layunin ng talatang ito ay upang masiguro na ang sistema ay kayang magproseso ng mas mahahabang input at makapagbigay ng tamang audio output. Maraming salamat sa iyong pakikinig at sana ay magustuhan mo ang resulta ng aming proyekto.')
        voice = request.GET.get('voice', 'fil-PH-BlessicaNeural')
        
        # Use async_to_sync to run the async function in a synchronous context
        audio_stream = async_to_sync(self.generate_audio)(text, voice)
        
        response = StreamingHttpResponse(audio_stream, content_type='audio/mpeg')
        response['Content-Disposition'] = 'inline; filename="tts.mp3"'
        
        # Close the audio stream after the response is sent
        response.streaming_content = audio_stream
        return response