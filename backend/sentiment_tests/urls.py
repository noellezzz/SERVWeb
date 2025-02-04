from django.urls import path, include
from rest_framework import routers
from . import api

router = routers.DefaultRouter()
router.register("sentiment-results", api.SentimentResultViewSet)
router.register("sentiment-tests", api.SentimentTestViewSet)

urlpatterns = router.urls
