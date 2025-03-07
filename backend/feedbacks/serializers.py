from rest_framework import serializers

from . import models
from sentiment_tests.serializers import SentimentResultSerializer
from users.serializers import SeniorCitizenInfoSerializer, EmployeeInfoSerializer, UserSerializer
from dashboard.serializers import ServiceSerializer

class FeedbackSerializer(serializers.ModelSerializer):
    user = SeniorCitizenInfoSerializer()
    employees = EmployeeInfoSerializer(many=True)
    services = ServiceSerializer(many=True)
    sentiment_results = SentimentResultSerializer(many=True, required=False)

    class Meta:
        model = models.Feedback
        fields = '__all__'
