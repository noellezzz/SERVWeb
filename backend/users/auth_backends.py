from django.contrib.auth.backends import ModelBackend
from django.db.models import Q
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

from .models import User

class EmailOrUsernameModelBackend(ModelBackend):
    """
    Authentication backend that allows users to log in with either username or email
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        # Handle multiple possible parameter names
        username_or_email = kwargs.get('username_or_email', 
                             kwargs.get('email', username))
        
        if not username_or_email or not password:
            return None
        
        # Determine if the input is an email or username based on format
        try:
            validate_email(username_or_email)
            # If validation passes, treat as email
            query = Q(email__iexact=username_or_email)
        except ValidationError:
            # If validation fails, treat as username
            query = Q(username__iexact=username_or_email)  # Fixed: added = instead of ()
        
        try:
            # Try to find the user
            user = User.objects.get(query)
            
            # Check the password
            if user.check_password(password):
                return user
            return None
        except User.DoesNotExist:
            return None
