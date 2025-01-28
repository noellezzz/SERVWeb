from django.urls import path, include
from rest_framework import routers

from . import api
from . import views


router = routers.DefaultRouter()
router.register("face-data", api.FaceDataViewSet)

urlpatterns = (
    path("", include(router.urls)),
)
