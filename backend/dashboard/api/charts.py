from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from feedbacks.models import Feedback
from feedbacks.serializers import FeedbackSerializer




class ChartViewSet(viewsets.ViewSet):

    
    @action(detail=False, methods=["get"])
    def topFeedbacks(self, request):

        # Get all feedbacks with their sentiment results
        feedbacks = Feedback.objects.prefetch_related('sentiment_results').all()

        # Sort feedbacks by the highest sentiment score
        sorted_feedbacks_positive = sorted(feedbacks, key=lambda feedback: feedback.sentiment_results.first().score if feedback.sentiment_results.exists() else 0, reverse=True)

        # Sort feedbacks by the lowest sentiment score
        sorted_feedbacks_negative = sorted(feedbacks, key=lambda feedback: feedback.sentiment_results.first().score if feedback.sentiment_results.exists() else 0)

        # Serialize the top positive feedbacks
        serializer_positive = FeedbackSerializer(sorted_feedbacks_positive[:10], many=True)

        # Serialize the top negative feedbacks
        serializer_negative = FeedbackSerializer(sorted_feedbacks_negative[:10], many=True)

        return Response({
            "top_positive_feedbacks": serializer_positive.data,
            "top_negative_feedbacks": serializer_negative.data
        })


