from django.urls import path, include
from rest_framework import routers

from . import api


router = routers.DefaultRouter()
router.register("queues", api.QueueViewSet)

urlpatterns = (
    path("", include(router.urls)),
)
