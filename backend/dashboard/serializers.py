from rest_framework import serializers

from . import models



# Serializer for the Service model
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Service
        fields = '__all__'