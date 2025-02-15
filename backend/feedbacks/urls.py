from django.urls import path, include
from rest_framework import routers

from . import api


router = routers.DefaultRouter()
router.register("feedbacks", api.FeedbackViewSet)

urlpatterns = router.urls
