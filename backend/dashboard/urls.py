from django.urls import path, include
from rest_framework import routers

from .api import services, charts, reports


router = routers.DefaultRouter()
services = router.register("services", services.ServiceViewSet)
# charts = router.register("charts", charts.ChartViewSet)
# reports = router.register("reports", reports.ReportViewSet)


urlpatterns = (
    path("", include(router.urls)),
)
