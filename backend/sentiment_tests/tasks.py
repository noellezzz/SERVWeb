from celery import shared_task
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from feedbacks.models import Feedback
from .models import SentimentTest, SentimentResult
from .serializers import SentimentResultSerializer
from serv.utils.vader import ServSentimentAnalysis
import numpy as np

@shared_task
def process_question(feedback_id, test_id, mode, user_channel_name):
    feedback = Feedback.objects.get(pk=feedback_id)
    test = SentimentTest.objects.get(pk=test_id)
    
    ssa = ServSentimentAnalysis(feedback.content, mode=mode)
    
    analysis = ssa.analyze()
    words = ssa.get_words()
    details = {
        'translated_text': analysis.get('translated_text', ''),
        'prediction': {
            'label': analysis.get('prediction', ''),
            'score': analysis.get('prediction_score', 0)
        },
        'polarity': analysis.get('polarity', {})
    }

    if mode == 'anew':
        if words:
            valence = np.mean([word['details']['valence'] for word in words])
            arousal = np.mean([word['details']['arousal'] for word in words])
            dominance = np.mean([word['details']['dominance'] for word in words])
        else:
            valence = arousal = dominance = 0
        details.update({
            'valence': valence,
            'arousal': arousal,
            'dominance': dominance
        })

    result = SentimentResult.objects.create(
        mode=mode,
        score=analysis['score'],
        sentiment=analysis['sentiment'],
        words=words,
        details=details,
        feedback=feedback,
        sentiment_test=test
    )

    serializer = SentimentResultSerializer(result)
    
    try:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            user_channel_name,
            {
                'type': 'send_message',
                'message': serializer.data
            }
        )
    except Exception as e:
        print(e)
        pass
    
    return serializer.data