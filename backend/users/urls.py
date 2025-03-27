from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api import UserAPI, SeniorCitizenInfoViewSet, EmployeeInfoViewSet, UserProfileView, UserViewSet, CustomAuthToken

router = DefaultRouter()
router.register(r'senior-citizens', SeniorCitizenInfoViewSet)
router.register(r'employee-info', EmployeeInfoViewSet)
# router.register(r'senior-citizen-info', SeniorCitizenInfoViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('current-user/', UserAPI.as_view(), name='current-user'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('login/', CustomAuthToken.as_view(), name='custom-login'),
    # Keeping the old URLs for backward compatibility
    path('senior-citizen-info/', SeniorCitizenInfoViewSet.as_view({'get': 'my_info', 'post': 'register', 'put': 'update_my_info'}), name='senior-citizen-api'),
]