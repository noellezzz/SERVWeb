from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api import UserAPI, SeniorCitizenInfoViewSet, EmployeeInfoViewSet

router = DefaultRouter()
router.register(r'senior-citizen-info', SeniorCitizenInfoViewSet)
router.register(r'employee-info', EmployeeInfoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]