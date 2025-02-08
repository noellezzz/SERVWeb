from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api import RegisterAPI, LoginAPI, UserAPI, BasicInformationViewSet, SeniorCitizenInfoViewSet, EmployeeInfoViewSet

router = DefaultRouter()
router.register(r'basic-info', BasicInformationViewSet)
router.register(r'senior-citizen-info', SeniorCitizenInfoViewSet)
router.register(r'employee-info', EmployeeInfoViewSet)

urlpatterns = [
    path('api/auth/register/', RegisterAPI.as_view(), name='register'),
    path('api/auth/login/', LoginAPI.as_view(), name='login'),
    path('api/auth/user/', UserAPI.as_view(), name='user'),
    path('', include(router.urls)),
]