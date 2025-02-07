from rest_framework import viewsets, permissions

from . import serializers
from . import models


class QueueViewSet(viewsets.ModelViewSet):
    """ViewSet for the Queue class"""

    queryset = models.Queue.objects.all()
    serializer_class = serializers.QueueSerializer
    permission_classes = [permissions.IsAuthenticated]
