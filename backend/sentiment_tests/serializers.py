from rest_framework import serializers

from . import models


class SentimentResultSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.SentimentResult
        fields = [
            "created",
            "id",
            "last_updated",
        ]

class SentimentTestSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.SentimentTest
        fields = [
            "created",
            "id",
            "last_updated",
        ]
