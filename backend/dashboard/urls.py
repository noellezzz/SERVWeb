from django.urls import path, include
from rest_framework import routers

from .api import services, charts, reports

router = routers.DefaultRouter()
router.register("services", services.ServiceViewSet, basename="services")
router.register("charts", charts.ChartViewSet, basename="charts")
# router.register("reports", reports.ReportViewSet, basename="reports")

urlpatterns = (
    path("", include(router.urls)),
)
