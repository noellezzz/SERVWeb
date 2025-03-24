from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.views import APIView
from rest_framework.decorators import action
from django.contrib.auth.models import User
from .serializers import UserSerializer, SeniorCitizenInfoSerializer, EmployeeInfoSerializer, UserProfileSerializer
from .models import SeniorCitizenInfo, EmployeeInfo, User


class UserAPI(generics.RetrieveAPIView):
    # permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserProfileView(APIView):
    """
    View to retrieve and update user profile information.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """
        Retrieve user profile information
        """
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
    
    def patch(self, request):
        """
        Update user profile information
        """
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SeniorCitizenInfoViewSet(viewsets.ModelViewSet):
    queryset = SeniorCitizenInfo.objects.all()
    serializer_class = SeniorCitizenInfoSerializer
    # permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_info(self, request):
        """
        Retrieve senior citizen information for the authenticated user
        """
        try:
            senior_info = SeniorCitizenInfo.objects.get(user=request.user)
            serializer = self.get_serializer(senior_info)
            return Response(serializer.data)
        except SeniorCitizenInfo.DoesNotExist:
            return Response(
                {"detail": "Senior citizen information not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def register(self, request):
        """
        Create senior citizen information for the authenticated user
        """
        # Check if senior citizen info already exists for this user
        if SeniorCitizenInfo.objects.filter(user=request.user).exists():
            return Response(
                {"detail": "Senior citizen information already exists for this user"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create new senior citizen info
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['put'], permission_classes=[permissions.IsAuthenticated])
    def update_my_info(self, request):
        """
        Update senior citizen information for the authenticated user
        """
        try:
            senior_info = SeniorCitizenInfo.objects.get(user=request.user)
            serializer = self.get_serializer(senior_info, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except SeniorCitizenInfo.DoesNotExist:
            return Response(
                {"detail": "Senior citizen information not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )


class EmployeeInfoViewSet(viewsets.ModelViewSet):
    queryset = EmployeeInfo.objects.all()
    serializer_class = EmployeeInfoSerializer
    # permission_classes = [permissions.IsAuthenticated]