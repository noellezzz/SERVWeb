from django.conf import settings
from django.utils import timezone
from django.views.generic import DetailView
from django_weasyprint import WeasyTemplateResponseMixin

from sentiment_tests.models import SentimentResult, SentimentTest
from sentiment_tests.serializers import SentimentResultSerializer, SentimentTestSerializer

class DownloadResultsView(WeasyTemplateResponseMixin, DetailView):
    queryset = SentimentResult.objects.all()
    serializer_class = SentimentResultSerializer
    template_name = 'sentiment_results.html' 
    pdf_filename = 'sentiment_results_report.pdf'  
    pdf_stylesheets = [settings.STATIC_ROOT + '/css/app.css'] 
    

class DownloadTestView(WeasyTemplateResponseMixin, DetailView):
    queryset = SentimentTest.objects.all()
    serializer_class = SentimentTestSerializer
    template_name = 'sentiment_tests.html' 
    pdf_filename = 'sentiment_tests.pdf'  
    pdf_stylesheets = [settings.STATIC_ROOT + '/css/app.css']
