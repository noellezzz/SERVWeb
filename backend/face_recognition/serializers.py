from rest_framework import serializers

from . import models


class FaceDataSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.FaceData
        fields = '__all__'
