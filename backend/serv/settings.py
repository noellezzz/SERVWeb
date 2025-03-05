"""
Django settings for serv project.

For more information on this file, see
https://docs.djangoproject.com/

"""

from pathlib import Path
import os
from dotenv import load_dotenv
load_dotenv()



getEnv = os.getenv


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

SECRET_KEY = getEnv('SECRET', 'django-insecure-#&^l)7d*%h&db4uft@dk%h-w&nup#pu%)a!d)c7jwgoixo5_hm0$')
DEBUG = bool(getEnv('DEBUG', True))
ALLOWED_HOSTS = getEnv('ALLOWED_HOSTS', 'localhost,127.0.0.1,*').split(',')

# Application definition
INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    
    
    # Third-party apps
    'django_extensions',
    'rest_framework',
    'rest_framework.authtoken',
    
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',  # For Google auth
    'dj_rest_auth',
    'dj_rest_auth.registration',
    
    'corsheaders',
    'channels',
    
    # Local Apps
    'dashboard',
    'sentiment_tests',
    'feedbacks',
    'users',
    'tts',
    'pdf',
]

# Add Jazzmin settings here
JAZZMIN_SETTINGS = {
    # Title on the login screen
    "site_title": "SERV Admin",
    
    # Title to show in the tab
    "site_header": "SERV",
    
    # Square logo to display in the sidebar
    "site_logo": "images/logo.png",
    
    # Welcome text on login screen
    "welcome_sign": "Welcome to the SERV Admin Portal",
    
    # Copyright on the footer
    "copyright": "SERV 2025",
    
    # The model admin to search from the search bar
    "search_model": "auth.User",
    
    # List of apps to show as dropdown
    "topmenu_links": [
        {"name": "Home", "url": "admin:index", "permissions": ["auth.view_user"]},
        {"name": "Site", "url": "/", "new_window": True},
    ],
    
    # Whether to display the side menu
    "show_sidebar": True,
    
    # Whether to auto expand the menu
    "navigation_expanded": True,
    
    # Custom icons for side menu apps/models
    "icons": {
        "auth": "fas fa-users-cog",
        "auth.user": "fas fa-user",
        "auth.Group": "fas fa-users",
        "users.user": "fas fa-user",
        "sentiment_tests": "fas fa-chart-line",
        "feedbacks": "fas fa-comment",
        "tts": "fas fa-volume-up",
        "pdf": "fas fa-file-pdf",
    },
}

# UI Customizer
JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": False,
    "footer_small_text": False,
    "body_small_text": False,
    "brand_small_text": False,
    "brand_colour": "navbar-success",
    "accent": "accent-primary",
    "navbar": "navbar-dark",
    "sidebar": "sidebar-dark-primary",
    "theme": "default",
    "button_classes": {
        "primary": "btn-primary",
        "secondary": "btn-secondary",
        "info": "btn-info",
        "warning": "btn-warning",
        "danger": "btn-danger",
        "success": "btn-success",
    },
}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware'
]

ROOT_URLCONF = 'serv.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ['templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'serv.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/


# URL to use when referring to static files
STATIC_URL = "/static/"

# Directory where collectstatic will place static files (for production)
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

# Additional directories where Django will look for static files
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
]

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'

# Django Channels
ASGI_APPLICATION = "serv.routing.application"
CHANNEL_LAYERS = {
    "default": {
        # "BACKEND": "channels.layers.InMemoryChannelLayer"
        # Use a redis instance
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {"hosts": [("127.0.0.1", 6379)],},
    },
}

# Rest Framework
REST_FRAMEWORK = {
    # 'DEFAULT_RENDERER_CLASSES': [
        # 'rest_framework.renderers.JSONRenderer',
    # ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        # 'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        # 'rest_framework.permissions.IsAdminUser',
        #  'rest_framework.permissions.IsAuthenticated' ,
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 100,

}

# Cors
CORS_ORIGIN_ALLOW_ALL = bool(getEnv('CORS_ORIGIN_ALLOW_ALL', False))
CORS_ALLOW_ALL_ORIGINS = bool(getEnv('CORS_ALLOW_ALL_ORIGINS', False))
# ACCESS_CONTROL_ALLOW_ORIGIN = getEnv('ACCESS_CONTROL_ALLOW_ORIGIN', '*')
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:3000",
#     "http://localhost:8000",
#     "http://localhost:8080",
#     "http://localhost:5000",
#     "*"
# ]
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = bool(getEnv('CORS_ALLOW_CREDENTIALS', True))





# ALLAUTH
SITE_ID = 1

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]
# Allauth settings
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_EMAIL_VERIFICATION = 'mandatory'
ACCOUNT_LOGOUT_ON_GET = True
ACCOUNT_UNIQUE_EMAIL = True


# settings.py
WEASYPRINT_BASEURL = '/'  # Treat URLs as file paths instead of absolute

AUTH_USER_MODEL = 'users.User'


# REDIS
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'