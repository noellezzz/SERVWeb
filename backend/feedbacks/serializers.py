from rest_framework import serializers

from . import models


class FeedbackSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Feedback
        fields = '__all__'
