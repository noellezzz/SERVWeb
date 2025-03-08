from django.conf import settings
from django.utils import timezone
from django.views.generic import DetailView
from django_weasyprint import WeasyTemplateResponseMixin
import numpy as np

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
        
        # Get all feedbacks for this service with their sentiment results
        all_feedbacks = Feedback.objects.filter(services__id=self.kwargs['pk']).prefetch_related('sentiment_results')
        
        # Create a list of (feedback, sentiment_score) tuples for efficient sorting
        feedback_scores = []
        total_performance_score = 0
        
        for feedback in all_feedbacks:
            sentiment = feedback.sentiment_results.first()
            score = sentiment.score if sentiment else 0
            feedback_scores.append((feedback, score))
            
            # Add rating to total performance score
            if feedback.rating:
                total_performance_score += feedback.rating
        
        # Sort by sentiment score and extract insights
        if feedback_scores:
            # Sort for positive (highest scores)
            sorted_positive = sorted(feedback_scores, key=lambda x: x[1], reverse=True)
            positive_feedbacks = [item[0] for item in sorted_positive[:3]]
            
            # Sort for negative (lowest scores)
            sorted_negative = sorted(feedback_scores, key=lambda x: x[1])
            negative_feedbacks = [item[0] for item in sorted_negative[:3]]
            
            # Calculate average sentiment score for this service
            scores = np.array([score for _, score in feedback_scores])
            avg_sentiment_score = float(np.mean(scores)) if len(scores) > 0 else 0
            
            # Calculate average performance score
            feedback_count = len(feedback_scores)
            avg_performance_score = (total_performance_score / feedback_count) if feedback_count > 0 else 0
            
            # Normalize to percentages
            avg_sentiment_score_pct = round(avg_sentiment_score * 100, 2)
            avg_performance_score_pct = round(avg_performance_score * 20, 2)  # Convert 5-star rating to percentage
        else:
            positive_feedbacks = []
            negative_feedbacks = []
            avg_sentiment_score = 0
            avg_sentiment_score_pct = 0
            avg_performance_score_pct = 0
            feedback_count = 0
        
        # Serialize the feedbacks
        context['positive_feedbacks'] = FeedbackSerializer(positive_feedbacks, many=True).data
        context['negative_feedbacks'] = FeedbackSerializer(negative_feedbacks, many=True).data
        
        # Add statistics to context
        context['total_feedbacks'] = feedback_count
        context['avg_sentiment_score'] = round(avg_sentiment_score, 2)
        context['average_sentiment_score'] = avg_sentiment_score_pct
        context['average_performance_score'] = avg_performance_score_pct
        
        # Calculate the difference between sentiment and performance scores
        if feedback_count > 0:
            # Convert both to same scale (0-1) for comparison
            normalized_sentiment = avg_sentiment_score
            normalized_performance = avg_performance_score / 5
            context['score_difference'] = round((normalized_sentiment - normalized_performance) * 100, 2)
        
        # Add the service data
        service = self.get_object()
        context['service'] = ServiceSerializer(service).data
        
        return context


class DownloadResultsView(WeasyTemplateResponseMixin, ServiceReportView):
    pdf_filename = 'service_results_report.pdf'  
    pdf_stylesheets = [settings.STATIC_ROOT + '/css/app.css']