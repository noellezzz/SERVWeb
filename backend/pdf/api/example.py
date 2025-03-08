from django.conf import settings
from django.utils import timezone
from django.views.generic import DetailView
from django_weasyprint import WeasyTemplateResponseMixin

from feedbacks.models import Feedback
from feedbacks.serializers import FeedbackSerializer

RESOURCE = 'feedbacks'
class DownloadView(WeasyTemplateResponseMixin, DetailView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    template_name = 'example.html' 
    pdf_filename = 'report.pdf'  
    pdf_stylesheets = [settings.STATIC_ROOT + '/css/app.css'] 
