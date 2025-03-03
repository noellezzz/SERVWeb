from django.urls import path
from .api import feedback, sentiment_results

urlpatterns = [
    path('feedbacks/<str:pk>', feedback.DownloadView.as_view(), name='download_feedbacks_pdf'),
    path('sentiment-tests/<str:pk>', sentiment_results.DownloadTestView.as_view(), name='download_sentiment-tests_pdf'),
    path('sentiment-results/<str:pk>', sentiment_results.DownloadResultsView.as_view(), name='download_sentiment-results_pdf'),
    
]
