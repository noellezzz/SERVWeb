import numpy as np
import logging


from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone

from . import serializers, models
from feedbacks.models import Feedback
from users.models import SeniorCitizenInfo, EmployeeInfo
from dashboard.models import Service
from serv.utils.vader import ServSentimentAnalysis

from .tasks import process_question
from kombu.exceptions import OperationalError

logger = logging.getLogger(__name__)
DEFAULT_MODE = 'anew'


class SentimentResultViewSet(viewsets.ModelViewSet):
    """ViewSet for the SentimentResult class"""

    queryset = models.SentimentResult.objects.all()
    serializer_class = serializers.SentimentResultSerializer

    def _not_numeric_array(self, value):
        """Helper method to check if a value is not a numeric array."""
        return not isinstance(value, list) or not all(isinstance(x, (int, float)) for x in value)


    def _perform_sentiment_analysis(self, feedback, test, mode):
        """Helper method to perform sentiment analysis and create a result."""
        if not feedback.content:
            raise ValueError("Feedback content is empty.")
        result = None

        ssa = ServSentimentAnalysis(feedback.content, mode=mode)
        analysis = ssa.analyze()
        words = ssa.get_words()
        details = {
            'translated_text': analysis.get('translated_text', ''),
            'prediction': {
                'label': analysis.get('prediction', ''),
                'score': analysis.get('prediction_score', 0)
            },
            'polarity': analysis.get('polarity', {})
        }

        if mode == 'anew':
            if words:
                valence = np.mean([word['details']['valence'] for word in words])
                arousal = np.mean([word['details']['arousal'] for word in words])
                dominance = np.mean([word['details']['dominance'] for word in words])
            else:
                valence = arousal = dominance = 0
            details.update({
                'valence': valence,
                'arousal': arousal,
                'dominance': dominance
            })

        result = models.SentimentResult.objects.create(
            mode=mode,
            score=analysis['score'],
            sentiment=analysis['sentiment'],
            words=words,
            details=details,
            feedback=feedback,
            sentiment_test=test
        )
        return result

    def multiCreate(self, payload, user_channel_name = 'sentiment_tests'):
        user_info = payload.get('user_info')
        evaluation = payload.get('evaluation')
        mode = payload.get('mode') or DEFAULT_MODE
        results = []

        if not user_info or not evaluation:
            raise ValueError("Payload must contain 'user_info' and 'evaluation'.")

        user_nid = user_info.get('userId')
        employee_ids = user_info.get('employeeIds')
        service_ids = user_info.get('serviceIds')

        if not user_nid or not employee_ids or not service_ids:
            raise ValueError("User info must contain 'userId', 'employeeIds', and 'serviceIds'.")

        if not isinstance(employee_ids, list):
            employee_ids = [employee_ids]
        
        if not isinstance(service_ids, list):
            service_ids = [service_ids]

        if self._not_numeric_array(employee_ids) or self._not_numeric_array(service_ids):
            raise ValueError("EmployeeIds and ServiceIds must be numeric arrays.")

        try:
            user = SeniorCitizenInfo.objects.get(nid=user_nid)
            employees = EmployeeInfo.objects.filter(id__in=employee_ids)
            services = Service.objects.filter(id__in=service_ids)

            for question in evaluation:
                content = question.get('answer')
                rating = question.get('rating')
                test_id = question.get('id')

                if not content:
                    logger.warning(f"Skipping feedback creation for question {test_id}: Content is empty.")
                    continue

                feedback = Feedback.objects.create(
                    content=content,
                    rating=rating,
                    user=user
                )
                feedback.employees.set(employees)
                feedback.services.set(services)
                
                feedback.save()
                

                try:
                    result = process_question.delay(feedback.id, test_id, mode, user_channel_name)
                except OperationalError as e:
                    logger.error(f"Error processing question {test_id}: {e}")
                    test = models.SentimentTest.objects.get(id=test_id)
                    result = self._perform_sentiment_analysis(feedback, test, mode)
                    
                results.append(result)                

        except SeniorCitizenInfo.DoesNotExist:
            raise ValueError(f"SeniorCitizenInfo with nid {user_nid} not found.")
        except EmployeeInfo.DoesNotExist:
            raise ValueError(f"One or more EmployeeInfo instances not found.")
        except Service.DoesNotExist:
            raise ValueError(f"One or more Service instances not found.")
        except models.SentimentTest.DoesNotExist:
            raise ValueError(f"SentimentTest with id {test_id} not found.")

    def create(self, request, *args, **kwargs):
        """Handle creation of a single sentiment result."""
        logger.info(f"Creating sentiment result: {request.data}")
        multiple = request.data.get('multiple', False)
        user_channel_name = request.data.get('user_channel_name', 'sentiment_tests')

        if multiple:
            try:
                results = self.multiCreate(request.data, user_channel_name)
                return Response(results)
            except ValueError as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        try:
            feedback_id = request.data.get('feedback_id')
            test_id = request.data.get('test_id')
            mode = request.data.get('mode') or DEFAULT_MODE

            if request.data.get('is_new_feedback', False):
                content = request.data.get('content')
                user_nid = request.data.get('user_nid')
                user = SeniorCitizenInfo.objects.get(nid=user_nid)
                feedback = Feedback.objects.create(
                    content=content,
                    user=user
                )
            else:
                feedback = Feedback.objects.get(id=feedback_id)

            test = models.SentimentTest.objects.get(id=test_id)
            result = self._perform_sentiment_analysis(feedback, test, mode)
            serializer = self.get_serializer(result)
            logger.info(f"Sentiment result created: {serializer.data}")
            return Response(serializer.data)

        except (Feedback.DoesNotExist, SeniorCitizenInfo.DoesNotExist, models.SentimentTest.DoesNotExist) as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class SentimentTestViewSet(viewsets.ModelViewSet):
    """ViewSet for the SentimentTest class"""

    queryset = models.SentimentTest.objects.all()
    serializer_class = serializers.SentimentTestSerializer

    def list(self, request):
        queryset = models.SentimentTest.objects.filter(deleted_at=None)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = serializers.SentimentTestSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = serializers.SentimentTestSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def results(self, request, pk=None):
        test = self.get_object()
        results = test.analysiss.all()
        serializer = serializers.SentimentResultSerializer(results, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def delete(self, request, pk=None):
        test = self.get_object()
        test.deleted_at = timezone.now()
        test.save()
        return Response({'status': 'deleted'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['delete'])
    def force_delete(self, request, pk=None):
        test = self.get_object()
        test.delete()
        return Response({'status': 'deleted'}, status=status.HTTP_200_OK)
