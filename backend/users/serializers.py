from rest_framework import serializers
from django.contrib.auth.models import User
from .models import BasicInformation, SeniorCitizenInfo, EmployeeInfo

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class BasicInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = BasicInformation
        fields = '__all__'

class SeniorCitizenInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeniorCitizenInfo
        fields = '__all__'

class EmployeeInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeInfo
        fields = '__all__'