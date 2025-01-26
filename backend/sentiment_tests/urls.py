from django.urls import path, include
from rest_framework import routers

from . import api
from . import views


router = routers.DefaultRouter()
router.register("SentimentResult", api.SentimentResultViewSet)
router.register("SentimentTest", api.SentimentTestViewSet)

urlpatterns = (
    path("api/v1/", include(router.urls)),
    path("sentiment-result/", views.SentimentResultListView.as_view(), name="sentiment_tests_SentimentResult_list"),
    path("sentiment-result/create/", views.SentimentResultCreateView.as_view(), name="sentiment_tests_SentimentResult_create"),
    path("sentiment-result/detail/<int:pk>/", views.SentimentResultDetailView.as_view(), name="sentiment_tests_SentimentResult_detail"),
    path("sentiment-result/update/<int:pk>/", views.SentimentResultUpdateView.as_view(), name="sentiment_tests_SentimentResult_update"),
    path("sentiment-result/delete/<int:pk>/", views.SentimentResultDeleteView.as_view(), name="sentiment_tests_SentimentResult_delete"),

    
    path("sentiment-test/", views.SentimentTestListView.as_view(), name="sentiment_tests_SentimentTest_list"),
    path("sentiment-test/create/", views.SentimentTestCreateView.as_view(), name="sentiment_tests_SentimentTest_create"),
    path("sentiment-test/detail/<int:pk>/", views.SentimentTestDetailView.as_view(), name="sentiment_tests_SentimentTest_detail"),
    path("sentiment-test/update/<int:pk>/", views.SentimentTestUpdateView.as_view(), name="sentiment_tests_SentimentTest_update"),
    path("sentiment-test/delete/<int:pk>/", views.SentimentTestDeleteView.as_view(), name="sentiment_tests_SentimentTest_delete"),

)
