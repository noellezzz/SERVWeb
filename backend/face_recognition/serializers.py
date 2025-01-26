from rest_framework import serializers

from . import models


class EmotionDataSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.EmotionData
        fields = [
            "last_updated",
            "id",
            "user_id",
            "created",
        ]
