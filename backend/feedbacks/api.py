from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action

from serv.utils.vader import ServSentimentAnalysis
from . import serializers,models

class FeedbackViewSet(viewsets.ModelViewSet):
    """ViewSet for the Feedback class"""
    
    # permission_classes = [permissions.IsAuthenticated] 
    queryset = models.Feedback.objects.all()
    serializer_class = serializers.FeedbackSerializer


    @action(detail=False, methods=['get'])
    def search(self, request):
        search_term = request.query_params.get('q', None)
        if search_term:
            feedbacks = models.Feedback.objects.filter(content__icontains=search_term)
        else:
            feedbacks = models.Feedback.objects.all()
        serializer = self.get_serializer(feedbacks, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def sentiment_results(self, request, pk=None):
        feedback = self.get_object()
        results = feedback.sentiment_results.all()
        serializer = SentimentResultSerializer(results, many=True)
        return Response(serializer.data)
        
    
    
