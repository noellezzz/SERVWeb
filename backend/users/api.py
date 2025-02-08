from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, BasicInformationSerializer, SeniorCitizenInfoSerializer, EmployeeInfoSerializer
from .models import BasicInformation, SeniorCitizenInfo, EmployeeInfo


class UserAPI(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class BasicInformationViewSet(viewsets.ModelViewSet):
    queryset = BasicInformation.objects.all()
    serializer_class = BasicInformationSerializer
    permission_classes = [permissions.IsAuthenticated]

class SeniorCitizenInfoViewSet(viewsets.ModelViewSet):
    queryset = SeniorCitizenInfo.objects.all()
    serializer_class = SeniorCitizenInfoSerializer
    permission_classes = [permissions.IsAuthenticated]

class EmployeeInfoViewSet(viewsets.ModelViewSet):
    queryset = EmployeeInfo.objects.all()
    serializer_class = EmployeeInfoSerializer
    permission_classes = [permissions.IsAuthenticated]