from rest_framework import serializers
from .models import BasicInformation, SeniorCitizenInfo, EmployeeInfo, User
from dashboard.serializers import ServiceSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class BasicInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = BasicInformation
        fields = '__all__'

class SeniorCitizenInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeniorCitizenInfo
        fields = '__all__'

class EmployeeInfoSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    services = ServiceSerializer(many=True)
    class Meta:
        model = EmployeeInfo
        fields = '__all__'