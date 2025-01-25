from rest_framework import viewsets, permissions

from . import serializers
from . import models


class EmotionDataViewSet(viewsets.ModelViewSet):
    """ViewSet for the EmotionData class"""

    queryset = models.EmotionData.objects.all()
    serializer_class = serializers.EmotionDataSerializer
    permission_classes = [permissions.IsAuthenticated]
