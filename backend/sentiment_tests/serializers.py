from rest_framework import serializers

from . import models


class SentimentResultSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.SentimentResult
        fields = '__all__'
        
class SentimentTestSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.SentimentTest
        fields = '__all__'