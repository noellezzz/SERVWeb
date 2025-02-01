from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action

from . import serializers
from . import models
from feedbacks.models import Feedback
from serv.utils.vader import VaderSentimentAnalyzer
import logging
logger = logging.getLogger(__name__)


class SentimentResultViewSet(viewsets.ModelViewSet):
    """ViewSet for the SentimentResult class"""

    # permission_classes = [permissions.IsAuthenticated]
    queryset = models.SentimentResult.objects.all()
    serializer_class = serializers.SentimentResultSerializer
    
    def create(self, request, *args, **kwargs):
        feedback_id = request.data.get('feedback_id')
        test_id = request.data.get('test_id')
        
        try:
            feedback = Feedback.objects.get(id=feedback_id)
            test = models.SentimentTest.objects.get(id=test_id)
            
            existing_result = models.SentimentResult.objects.filter(feedback=feedback, sentiment_test=test).first()
            
            if existing_result:
                serializer = self.get_serializer(existing_result)
                return Response(serializer.data)
            
            if not feedback.content:
                return Response({'error': 'Feedback content is empty'}, status=status.HTTP_400_BAD_REQUEST)
            
            analyzer = VaderSentimentAnalyzer()
            sentiment_result = analyzer.analyze(feedback.content)
            
            result = models.SentimentResult.objects.create(
                label=sentiment_result['label'],
                score=sentiment_result['score'],
                positive_words=sentiment_result['positive_words'],
                negative_words=sentiment_result['negative_words'],
                detailed_results=sentiment_result['sentiment'],
                feedback=feedback,
                sentiment_test=test
            )
            
            serializer = self.get_serializer(result)
            logger.info(f"Sentiment result created: {serializer.data}")
            return Response(serializer.data)
            
        except Feedback.DoesNotExist:
            return Response({'error': 'Feedback not found'}, status=status.HTTP_404_NOT_FOUND)
        except models.SentimentTest.DoesNotExist:
            return Response({'error': 'Test not found'}, status=status.HTTP_404_NOT_FOUND)


class SentimentTestViewSet(viewsets.ModelViewSet):
    """ViewSet for the SentimentTest class"""

    # permission_classes = [permissions.IsAuthenticated]
    queryset = models.SentimentTest.objects.all()
    serializer_class = serializers.SentimentTestSerializer
    
    @action(detail=True, methods=['get'])
    def results(self, request, pk=None):
        test = self.get_object()
        results = test.sentiment_results.all()
        serializer = serializers.SentimentResultSerializer(results, many=True)
        return Response(serializer.data)
