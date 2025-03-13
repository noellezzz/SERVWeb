from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api.charts import ChartViewSet
from .api.services import ServiceViewSet



# Create a router and register our viewsets
router = DefaultRouter()
router.register(r'charts', ChartViewSet, basename='charts')
router.register(r'services', ServiceViewSet, basename='services')

urlpatterns = (
    path("", include(router.urls)),
)
