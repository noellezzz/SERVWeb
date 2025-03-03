from django.conf import settings
from django.utils import timezone
from django.views.generic import DetailView
from django_weasyprint import WeasyTemplateResponseMixin

from sentiment_tests.models import SentimentResult, SentimentTest
from sentiment_tests.serializers import SentimentResultSerializer, SentimentTestSerializer
import logging

logger = logging.getLogger(__name__)

class DownloadResultsView(WeasyTemplateResponseMixin, DetailView):
    queryset = SentimentResult.objects.all()
    serializer_class = SentimentResultSerializer
    template_name = 'sentiment_results.html' 
    pdf_filename = 'sentiment_results_report.pdf'  
    pdf_stylesheets = [settings.STATIC_ROOT + '/css/app.css'] 

    def get_queryset(self):
        queryset = SentimentResult.objects.all()
        sentiment_test_id = self.request.GET.get('id')
        if sentiment_test_id:
            queryset = queryset.filter(id=sentiment_test_id)
        for result in queryset:
            logger.info(f"SentimentResult ID: {result.id}, Sentiment: {result.sentiment}")
        return queryset
    

class DownloadTestView(WeasyTemplateResponseMixin, DetailView):
    queryset = SentimentTest.objects.all()
    serializer_class = SentimentTestSerializer
    template_name = 'sentiment_tests.html' 
    pdf_filename = 'sentiment_tests.pdf'  
    pdf_stylesheets = [settings.STATIC_ROOT + '/css/app.css']



