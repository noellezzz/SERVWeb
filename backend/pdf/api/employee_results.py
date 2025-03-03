from django.conf import settings
from django.utils import timezone
from django.views.generic import DetailView
from django_weasyprint import WeasyTemplateResponseMixin

from feedbacks.models import Feedback
from feedbacks.serializers import FeedbackSerializer
from users.models import EmployeeInfo
from users.serializers import EmployeeInfoSerializer
import logging
import pprint


logger = logging.getLogger(__name__)

class EmployeeReportView(DetailView):
    model = EmployeeInfo
    serializer_class = EmployeeInfoSerializer
    template_name = 'employee_results.html'
    queryset = EmployeeInfo.objects.all()   

    def get_queryset(self, *args, **kwargs):
        qs = self.queryset.filter(id=self.kwargs['pk'])
        return qs
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['now'] = timezone.now()
        feedbacks  = Feedback.objects.filter(employees__id=self.kwargs['pk'])
        context['feedbacks'] = FeedbackSerializer(feedbacks, many=True).data
        context['employee'] = EmployeeInfoSerializer(self.get_object()).data	
        pprint.pprint(context['feedbacks'][0])
        pprint.pprint(context['employee'])
        return context

class DownloadResultsView(WeasyTemplateResponseMixin, EmployeeReportView):
    pdf_filename = 'employee_results_report.pdf'  
    pdf_stylesheets = [settings.STATIC_ROOT + '/css/app.css']

