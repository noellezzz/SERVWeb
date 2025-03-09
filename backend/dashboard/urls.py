from django.urls import path
from rest_framework.routers import DefaultRouter
from .api.charts import ChartViewSet

# Create a router and register our viewsets
router = DefaultRouter()
router.register(r'charts', ChartViewSet, basename='charts')

urlpatterns = router.urls
