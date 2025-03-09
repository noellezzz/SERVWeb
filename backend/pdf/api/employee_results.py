from django.conf import settings
from django.utils import timezone
from django.views.generic import DetailView
from django_weasyprint import WeasyTemplateResponseMixin
from django.db.models import Avg, F, Q
import numpy as np

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
        
        # Get all feedbacks for this employee with their sentiment results
        all_feedbacks = Feedback.objects.filter(employees__id=self.kwargs['pk']).prefetch_related('sentiment_results')
        
        # Create a list of (feedback, sentiment_score) tuples for efficient sorting
        feedback_scores = []
        for feedback in all_feedbacks:
            sentiment = feedback.sentiment_results.first()
            score = sentiment.score if sentiment else 0
            feedback_scores.append((feedback, score))
        
        # Sort by sentiment score using numpy for better performance with large datasets
        if feedback_scores:
            # Sort for positive (highest scores)
            sorted_positive = sorted(feedback_scores, key=lambda x: x[1], reverse=True)
            positive_feedbacks = [item[0] for item in sorted_positive[:3]]
            
            # Sort for negative (lowest scores)
            sorted_negative = sorted(feedback_scores, key=lambda x: x[1])
            negative_feedbacks = [item[0] for item in sorted_negative[:3]]
            
            # Calculate average sentiment score for this employee
            scores = np.array([score for _, score in feedback_scores])
            avg_sentiment_score = float(np.mean(scores)) if len(scores) > 0 else 0
        else:
            positive_feedbacks = []
            negative_feedbacks = []
            avg_sentiment_score = 0
        
        # Serialize the feedbacks
        context['positive_feedbacks'] = FeedbackSerializer(positive_feedbacks, many=True).data
        context['negative_feedbacks'] = FeedbackSerializer(negative_feedbacks, many=True).data
        
        # Get total number of feedbacks for statistics
        context['total_feedbacks'] = len(feedback_scores)
        context['avg_sentiment_score'] = round(avg_sentiment_score, 2) 
        
        # Add the employee data
        employee = self.get_object()
        context['employee'] = EmployeeInfoSerializer(employee).data
        
        # Compare sentiment score with employee's actual score if available
        employee_score = getattr(employee, 'score', None)
        if employee_score is not None:
            context['score_difference'] = round((avg_sentiment_score * 100) - employee_score, 2)
        
        return context

class DownloadResultsView(WeasyTemplateResponseMixin, EmployeeReportView):
    pdf_filename = 'employee_results_report.pdf'  
    pdf_stylesheets = [settings.STATIC_ROOT + '/css/app.css']