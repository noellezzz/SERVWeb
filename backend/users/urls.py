from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api import UserAPI, BasicInformationViewSet, SeniorCitizenInfoViewSet, EmployeeInfoViewSet

router = DefaultRouter()
router.register(r'basic-info', BasicInformationViewSet)
router.register(r'senior-citizen-info', SeniorCitizenInfoViewSet)
router.register(r'employee-info', EmployeeInfoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]