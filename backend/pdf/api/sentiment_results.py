from django.conf import settings
from django.utils import timezone
from django.views.generic import DetailView
from django_weasyprint import WeasyTemplateResponseMixin

from sentiment_tests.models import SentimentResult, SentimentTest
from sentiment_tests.serializers import SentimentResultSerializer, SentimentTestSerializer
import logging
import pprint
logger = logging.getLogger(__name__)

class SentimentResultView(DetailView):
    model = SentimentResult
    serializer_class = SentimentResultSerializer
    template_name = 'sentiment_results.html'
    queryset = SentimentResult.objects.all()    

    def get_queryset(self, *args, **kwargs):
        qs = self.queryset.filter(id=self.kwargs['pk'])
        return qs
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['now'] = timezone.now()
        pprint.pprint(context)
        return context

class DownloadResultsView(WeasyTemplateResponseMixin, SentimentResultView):
    pdf_filename = 'sentiment_results_report.pdf'  
    pdf_stylesheets = [settings.STATIC_ROOT + '/css/app.css'] 

    

class DownloadTestView(WeasyTemplateResponseMixin, DetailView):
    queryset = SentimentTest.objects.all()
    serializer_class = SentimentTestSerializer
    template_name = 'sentiment_tests.html' 
    pdf_filename = 'sentiment_tests.pdf'  
    pdf_stylesheets = [settings.STATIC_ROOT + '/css/app.css']



