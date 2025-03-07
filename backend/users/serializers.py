from rest_framework import serializers
from .models import SeniorCitizenInfo, EmployeeInfo, User
from dashboard.serializers import ServiceSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class SeniorCitizenInfoSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = SeniorCitizenInfo
        fields = '__all__'

class EmployeeInfoSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    services = ServiceSerializer(many=True)
    class Meta:
        model = EmployeeInfo
        fields = '__all__'