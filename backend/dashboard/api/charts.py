from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from feedbacks.models import Feedback
from feedbacks.serializers import FeedbackSerializer
from users.models import User, SeniorCitizenInfo, EmployeeInfo
from collections import defaultdict
from django.db.models import Count
from django.utils import timezone

class ChartViewSet(viewsets.ViewSet):

    @action(detail=False, methods=["get"])
    def topFeedbacks(self, request):
        # Get all feedbacks with their sentiment results
        feedbacks = Feedback.objects.prefetch_related('sentiment_results').all()

        # Sort feedbacks by the highest sentiment score
        sorted_feedbacks_positive = sorted(feedbacks, key=lambda feedback: feedback.sentiment_results.first().score if feedback.sentiment_results.exists() else 0, reverse=True)

        # Sort feedbacks by the lowest sentiment score
        sorted_feedbacks_negative = sorted(feedbacks, key=lambda feedback: feedback.sentiment_results.first().score if feedback.sentiment_results.exists() else 0)

        # Serialize the top positive feedbacks
        serializer_positive = FeedbackSerializer(sorted_feedbacks_positive[:10], many=True)

        # Serialize the top negative feedbacks
        serializer_negative = FeedbackSerializer(sorted_feedbacks_negative[:10], many=True)

        return Response({
            "top_positive_feedbacks": serializer_positive.data,
            "top_negative_feedbacks": serializer_negative.data
        })

    @action(detail=False, methods=["get"])
    def sentimentDistribution(self, request):
        feedbacks = Feedback.objects.prefetch_related('sentiment_results').all()
        total_feedbacks = feedbacks.count()

        sentiment_counts = {
            "very_positive": 0,
            "positive": 0,
            "neutral": 0,
            "negative": 0,
            "very_negative": 0
        }

        for feedback in feedbacks:
            if feedback.sentiment_results.exists():
                score = feedback.sentiment_results.first().score
                if score >= 0.8:
                    sentiment_counts["very_positive"] += 1
                elif score >= 0.6:
                    sentiment_counts["positive"] += 1
                elif score >= 0.4:
                    sentiment_counts["neutral"] += 1
                elif score >= 0.2:
                    sentiment_counts["negative"] += 1
                else:
                    sentiment_counts["very_negative"] += 1

        sentiment_percentages = {key: (value / total_feedbacks) * 100 for key, value in sentiment_counts.items()} if total_feedbacks > 0 else sentiment_counts

        return Response({
            "total_feedbacks": total_feedbacks,
            "sentiment_counts": sentiment_counts,
            "sentiment_percentages": sentiment_percentages
        })

    @action(detail=False, methods=["get"])
    def moodData(self, request):
        feedbacks = Feedback.objects.prefetch_related('sentiment_results').all()
        mood_data = defaultdict(lambda: {'Happy': 0, 'Neutral': 0, 'Sad': 0, 'count': 0})

        for feedback in feedbacks:
            if feedback.sentiment_results.exists():
                score = feedback.sentiment_results.first().score
                month = feedback.created.strftime('%b')
                mood_data[month]['count'] += 1
                if score >= 0.6:
                    mood_data[month]['Happy'] += 1
                elif score >= 0.4:
                    mood_data[month]['Neutral'] += 1
                else:
                    mood_data[month]['Sad'] += 1

        for month in mood_data:
            count = mood_data[month]['count']
            if count > 0:
                mood_data[month]['Happy'] /= count
                mood_data[month]['Neutral'] /= count
                mood_data[month]['Sad'] /= count
            del mood_data[month]['count']

        mood_data_list = [{'month': month, **data} for month, data in mood_data.items()]
        return Response(mood_data_list)

    @action(detail=False, methods=["get"])
    def demographics(self, request):
        """
        Return demographic data for senior citizens:
        - Gender distribution
        - Age group distribution
        - Role distribution
        """
        today = timezone.now().date()

        # Get senior citizens
        senior_users = User.objects.select_related("seniorcitizeninfo").filter(seniorcitizeninfo__isnull=False)

        # Gender Distribution
        gender_mapping = {'M': 'Male', 'F': 'Female', 'O': 'Other'}
        gender_counts = senior_users.values('gender').annotate(count=Count('id'))

        gender_data = [
            {
                'name': gender_mapping.get(item['gender'], 'Not Specified'),
                'value': item['count']
            }
            for item in gender_counts
        ]

        # Age Group Distribution
        age_groups = {
            '60-65': 0,
            '66-70': 0,
            '71-75': 0,
            '76-80': 0,
            '81+': 0
        }

        for user in senior_users:
            if user.date_of_birth:
                age = today.year - user.date_of_birth.year
                if today.month < user.date_of_birth.month or (
                    today.month == user.date_of_birth.month and today.day < user.date_of_birth.day
                ):
                    age -= 1  # Adjust if birthday hasn't occurred this year

                if 60 <= age <= 65:
                    age_groups['60-65'] += 1
                elif 66 <= age <= 70:
                    age_groups['66-70'] += 1
                elif 71 <= age <= 75:
                    age_groups['71-75'] += 1
                elif 76 <= age <= 80:
                    age_groups['76-80'] += 1
                elif age >= 81:
                    age_groups['81+'] += 1

        age_data = [{'age': key, 'count': value} for key, value in age_groups.items()]

        # Role Distribution
        role_counts = senior_users.values('role').annotate(count=Count('id'))
        role_data = [
            {
                'name': item['role'].capitalize() if item['role'] else 'Not Specified',
                'value': item['count']
            }
            for item in role_counts
        ]

        return Response({
            'gender_distribution': gender_data,
            'age_distribution': age_data,
            'role_distribution': role_data
        })
    
    @action(detail=False, methods=["get"])
    def stats(self, request):
        """
        Return key statistics for the dashboard:
        - Senior Citizens
        - Employees
        - Average Feedback Score
        - Total Feedbacks
        """
        try:
            # Get counts from database
            senior_count = SeniorCitizenInfo.objects.count()
            employee_count = EmployeeInfo.objects.count()
            
            # Calculate average feedback sentiment score
            feedbacks = Feedback.objects.prefetch_related('sentiment_results').all()
            feedback_count = feedbacks.count()  # Total feedback count
            
            avg_sentiment = 0
            sentiment_sum = 0
            feedbacks_with_sentiment = 0
            
            for feedback in feedbacks:
                if feedback.sentiment_results.exists():
                    sentiment = feedback.sentiment_results.first().score
                    sentiment_sum += sentiment
                    feedbacks_with_sentiment += 1
            
            if feedbacks_with_sentiment > 0:
                avg_sentiment = round(sentiment_sum / feedbacks_with_sentiment, 2)
            
            # Return only the requested statistics
            return Response({
                'stats': [
                    {
                        'name': 'Senior Citizens',
                        'value': senior_count,
                        'color': '#EC4899',
                        'icon': 'FaUserFriends'
                    },
                    {
                        'name': 'Employees',
                        'value': employee_count,
                        'color': '#10B981',
                        'icon': 'FaUserTie'
                    },
                    {
                        'name': 'Avg. Sentiment',
                        'value': avg_sentiment,
                        'color': '#F59E0B',
                        'icon': 'FaSmile'
                    },
                    {
                        'name': 'Total Feedbacks',
                        'value': feedback_count,
                        'color': '#3B82F6', 
                        'icon': 'FaCommentAlt'
                    }
                ]
            })
        except Exception as e:
            print(f"Error in stats endpoint: {str(e)}")
            return Response(
                {"error": str(e)}, 
                status=500
            )