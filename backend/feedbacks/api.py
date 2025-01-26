from rest_framework import viewsets, permissions

from . import serializers
from . import models


class FeedbackViewSet(viewsets.ModelViewSet):
    """ViewSet for the Feedback class"""

    queryset = models.Feedback.objects.all()
    serializer_class = serializers.FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]
