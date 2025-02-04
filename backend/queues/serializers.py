from rest_framework import serializers

from . import models


class QueueSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Queue
        fields = [
            "id",
            "created",
            "last_updated",
        ]
