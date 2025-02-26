from rest_framework import serializers

from . import models
from users.serializers import SeniorCitizenInfoSerializer, EmployeeInfoSerializer, UserSerializer
from dashboard.serializers import ServiceSerializer

class FeedbackSerializer(serializers.ModelSerializer):
    user = SeniorCitizenInfoSerializer()
    employees = EmployeeInfoSerializer(many=True)
    services = ServiceSerializer(many=True)
    class Meta:
        model = models.Feedback
        fields = '__all__'
