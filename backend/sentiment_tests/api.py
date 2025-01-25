from rest_framework import viewsets, permissions

from . import serializers
from . import models


class SentimentResultViewSet(viewsets.ModelViewSet):
    """ViewSet for the SentimentResult class"""

    queryset = models.SentimentResult.objects.all()
    serializer_class = serializers.SentimentResultSerializer
    permission_classes = [permissions.IsAuthenticated]


class SentimentTestViewSet(viewsets.ModelViewSet):
    """ViewSet for the SentimentTest class"""

    queryset = models.SentimentTest.objects.all()
    serializer_class = serializers.SentimentTestSerializer
    permission_classes = [permissions.IsAuthenticated]
