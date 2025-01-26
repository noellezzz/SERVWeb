from django.urls import path, include
from rest_framework import routers

from . import api
from . import views


router = routers.DefaultRouter()
router.register("Queue", api.QueueViewSet)

urlpatterns = (
    path("api/v1/", include(router.urls)),
    path("", views.QueueListView.as_view(), name="queues_Queue_list"),
    path("create/", views.QueueCreateView.as_view(), name="queues_Queue_create"),
    path("detail/<int:pk>/", views.QueueDetailView.as_view(), name="queues_Queue_detail"),
    path("update/<int:pk>/", views.QueueUpdateView.as_view(), name="queues_Queue_update"),
    path("delete/<int:pk>/", views.QueueDeleteView.as_view(), name="queues_Queue_delete"),

)
