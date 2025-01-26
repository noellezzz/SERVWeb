from django.urls import path, include
from rest_framework import routers

from . import api
from . import views


router = routers.DefaultRouter()
router.register("emotion-data", api.EmotionDataViewSet)

urlpatterns = (
    path("", include(router.urls)),
)
