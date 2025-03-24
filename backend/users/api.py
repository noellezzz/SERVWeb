from rest_framework import viewsets, permissions, generics, status, filters
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.views import APIView
from rest_framework.decorators import action
from django.contrib.auth.models import User
from .serializers import UserSerializer, SeniorCitizenInfoSerializer, EmployeeInfoSerializer, UserProfileSerializer
from .models import SeniorCitizenInfo, EmployeeInfo, User
from django.contrib.auth.hashers import make_password

# Custom permission for users with admin role
class IsAdminRole(permissions.BasePermission):
    """
    Custom permission to only allow users with 'admin' role.
    """
    def has_permission(self, request, view):
        # Check if user is authenticated and has admin role
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role == 'admin' or request.user.is_staff or request.user.is_superuser)
        )


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


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing users
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    # Use our custom permission class instead of IsAdminUser
    permission_classes = [IsAdminRole]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined', 'role']
    
    def perform_create(self, serializer):
        """
        Hash password on user creation
        """
        # Check if password was provided and hash it
        if 'password' in self.request.data:
            password = make_password(self.request.data['password'])
            serializer.save(password=password)
        else:
            serializer.save()
    
    def perform_update(self, serializer):
        """
        Hash password on user update if provided
        """
        # Check if password was provided and hash it
        if 'password' in self.request.data and self.request.data['password']:
            password = make_password(self.request.data['password'])
            serializer.save(password=password)
        else:
            serializer.save()
    
    def get_queryset(self):
        """
        Filter queryset based on role if specified
        """
        queryset = super().get_queryset()
        role = self.request.query_params.get('role', None)
        
        if role and role != 'all':
            queryset = queryset.filter(role=role)
        
        return queryset