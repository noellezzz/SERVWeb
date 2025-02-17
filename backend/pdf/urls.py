from django.urls import path
from .views import DownloadView

urlpatterns = [
    path('download/<str:pk>/', DownloadView.as_view(), name='download_pdf'),
]
