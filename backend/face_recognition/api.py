from rest_framework import viewsets, permissions

from . import serializers
from . import models


class FaceDataViewSet(viewsets.ModelViewSet):
    """ViewSet for the FaceData class"""

    queryset = models.FaceData.objects.all()
    serializer_class = serializers.FaceDataSerializer
    permission_classes = [permissions.IsAuthenticated]
