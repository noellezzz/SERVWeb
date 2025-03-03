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
        return context




class DownloadResultsView(WeasyTemplateResponseMixin, ServiceReportView):
    pdf_filename = 'employee_results_report.pdf'  
    pdf_stylesheets = [settings.STATIC_ROOT + '/css/app.css']
