from django.urls import path, include
from rest_framework import routers

from . import api
from . import views


router = routers.DefaultRouter()
router.register("Feedback", api.FeedbackViewSet)

urlpatterns = (
    path("api/v1/", include(router.urls)),
    path("", views.FeedbackListView.as_view(), name="feedbacks_Feedback_list"),
    path("create/", views.FeedbackCreateView.as_view(), name="feedbacks_Feedback_create"),
    path("detail/<int:pk>/", views.FeedbackDetailView.as_view(), name="feedbacks_Feedback_detail"),
    path("update/<int:pk>/", views.FeedbackUpdateView.as_view(), name="feedbacks_Feedback_update"),
    path("delete/<int:pk>/", views.FeedbackDeleteView.as_view(), name="feedbacks_Feedback_delete"),

)
