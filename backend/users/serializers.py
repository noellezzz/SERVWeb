from rest_framework import serializers
from .models import SeniorCitizenInfo, EmployeeInfo, User
from dashboard.serializers import ServiceSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class SeniorCitizenInfoSerializer(serializers.ModelSerializer):
    """
    Serializer for the SeniorCitizenInfo model
    """
    class Meta:
        model = SeniorCitizenInfo
        fields = ['id', 'nid', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def create(self, validated_data):
        # Add the user from the context
        user = self.context.get('request').user
        validated_data['user'] = user
        return super().create(validated_data)


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model to handle profile information
    """
    has_senior_info = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'date_of_birth', 'gender', 'address', 'contact_number',
            'has_senior_info'
        ]
        read_only_fields = ['id', 'email']
    
    def get_has_senior_info(self, obj):
        """
        Check if the user has senior citizen information
        """
        return SeniorCitizenInfo.objects.filter(user=obj).exists()

class EmployeeInfoSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    services = ServiceSerializer(many=True)
    class Meta:
        model = EmployeeInfo
        fields = '__all__'