# This file ensures that our authentication backend is properly registered
from django.conf import settings

def register_auth_backend():
    """
    Ensure our custom auth backend is in AUTHENTICATION_BACKENDS setting
    """
    custom_backend = 'users.auth_backends.EmailOrUsernameModelBackend'
    
    # This function doesn't modify settings at runtime as that's not possible
    # It serves as documentation of what needs to be in settings.py
    
    # The following should be added to settings.py:
    """
    AUTHENTICATION_BACKENDS = [
        'users.auth_backends.EmailOrUsernameModelBackend',
        'django.contrib.auth.backends.ModelBackend',
    ]
    """
    
    # Check if our documentation matches reality
    if hasattr(settings, 'AUTHENTICATION_BACKENDS') and custom_backend not in settings.AUTHENTICATION_BACKENDS:
        import warnings
        warnings.warn(
            f"The '{custom_backend}' is not in AUTHENTICATION_BACKENDS. "
            "Add it to your settings.py for email/username login to work."
        )

# Run the check when this module is imported
register_auth_backend()
