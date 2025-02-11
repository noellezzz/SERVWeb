from django.urls import path, include
from rest_framework import routers
from . import api

router = routers.DefaultRouter()
router.register("results", api.SentimentResultViewSet)
router.register("tests", api.SentimentTestViewSet)

urlpatterns = router.urls
