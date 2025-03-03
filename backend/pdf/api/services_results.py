from django.conf import settings
from django.utils import timezone
from django.views.generic import DetailView
from django_weasyprint import WeasyTemplateResponseMixin

from feedbacks.models import Feedback
from feedbacks.serializers import FeedbackSerializer
from dashboard.models import Service    
from dashboard.serializers import ServiceSerializer


import logging
import pprint


logger = logging.getLogger(__name__)

class ServiceReportView(DetailView):
    model = Service
    template_name = 'services_results.html'
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

    def get_queryset(self, *args, **kwargs):
        qs = self.queryset.filter(id=self.kwargs['pk'])
        return qs
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['now'] = timezone.now()
        feedbacks  = Feedback.objects.filter(services__id=self.kwargs['pk'])
        context['feedbacks'] = FeedbackSerializer(feedbacks, many=True).data
        context['service'] = ServiceSerializer(self.get_object()).data
        
        total_sentiment_score = 0
        total_performance_score = 0
        feedback_count = len(context['feedbacks'])

        for feedback in context['feedbacks']:
            if feedback.get('sentiment_results'):
                sentiment_score = feedback['sentiment_results'][0]['score']
                total_sentiment_score += sentiment_score

            if feedback.get('rating'):
                total_performance_score += feedback['rating']

        # Calculate average scores
        if feedback_count > 0:
            context['average_sentiment_score'] = (total_sentiment_score / feedback_count) * 100
            context['average_performance_score'] = (total_performance_score / feedback_count) * 20  # Convert 5-star rating to 100
        else:
            context['average_sentiment_score'] = 0
            context['average_performance_score'] = 0

        return context




class DownloadResultsView(WeasyTemplateResponseMixin, ServiceReportView):
    pdf_filename = 'service_results_report.pdf'  
    pdf_stylesheets = [settings.STATIC_ROOT + '/css/app.css']
