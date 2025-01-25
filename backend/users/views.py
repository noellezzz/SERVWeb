from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .serializers import UserSerializer, UserProfileSerializer,  UserProfileUpdateSerializer
from rest_framework import status
from rest_framework.decorators import api_view
import logging

logger = logging.getLogger(__name__)

class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'message': 'Signup successful!',
                'token': token.key,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Look up the user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)

        # Authenticate using the found user and password
        user = authenticate(username=user.username, password=password)
        
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name
                }
            }, status=status.HTTP_200_OK)
        
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        
        auth_header = request.headers.get('Authorization', None)
        if auth_header is None or not auth_header.startswith('Token '):
            return Response({"error": "Authorization token missing or invalid"}, status=status.HTTP_400_BAD_REQUEST)
        token_key = auth_header.split(' ')[1]
        try:
            
            token = Token.objects.get(key=token_key)    
            
            token.delete()
            return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
        except Token.DoesNotExist:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error during logout: {str(e)}")
            return Response({"error": "An error occurred during logout"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        

class UserProfileView(APIView):
    # permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserUpdateProfileView(APIView):
    permission_classes = [IsAuthenticated] 
    
    def put(self, request):
        user = request.user  # Get the user making the request
        
        # Log the incoming request data for debugging
        logger.debug(f"Request data: {request.data}")

        # Use the serializer to validate and update user fields
        serializer = UserProfileUpdateSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            # If password is included, handle password update
            password = serializer.validated_data.get('password')
            if password:
                user.set_password(password)  # Hash the new password
                user.save()  # Save user with hashed password
            
            # Save the other fields (username, email, first_name, last_name)
            serializer.save()  # This will save the updated user fields (including first_name and last_name)
            
            # Respond with the updated user data
            return Response(serializer.data, status=status.HTTP_200_OK)

        # If the serializer is invalid, return the validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)