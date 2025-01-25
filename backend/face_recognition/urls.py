from django.urls import path, include
from rest_framework import routers

from . import api
from . import views


router = routers.DefaultRouter()
router.register("EmotionData", api.EmotionDataViewSet)

urlpatterns = (
    path("api/v1/", include(router.urls)),
    path("", views.EmotionDataListView.as_view(), name="face_recognition_EmotionData_list"),
    path("create/", views.EmotionDataCreateView.as_view(), name="face_recognition_EmotionData_create"),
    path("detail/<int:pk>/", views.EmotionDataDetailView.as_view(), name="face_recognition_EmotionData_detail"),
    path("update/<int:pk>/", views.EmotionDataUpdateView.as_view(), name="face_recognition_EmotionData_update"),
    path("delete/<int:pk>/", views.EmotionDataDeleteView.as_view(), name="face_recognition_EmotionData_delete"),

)
