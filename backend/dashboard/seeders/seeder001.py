import os
import json
import random
from django.db import transaction
from feedbacks.models import Feedback
from sentiment_tests.models import SentimentTest, SentimentResult
from users.models import SeniorCitizenInfo, EmployeeInfo
from dashboard.models import Service
from serv.utils.vader import ServSentimentAnalysis
import numpy as np

DATA_PATH = os.path.join(os.path.dirname(__file__), 'data/reviews.json')

def create_feedbacks():
    with open(DATA_PATH, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    random.shuffle(data)
    selected_data = data[:50]

    feedbacks = []

    for feedback in selected_data:
        random_senior_citizen = SeniorCitizenInfo.objects.order_by('?').first()
        if not random_senior_citizen:
            raise ValueError("No SeniorCitizenInfo instances found in the database.")

        random_employee = EmployeeInfo.objects.order_by('?').first()
        if not random_employee:
            raise ValueError("No EmployeeInfo instances found in the database.")

        random_service = Service.objects.order_by('?').first()
        if not random_service:
            raise ValueError("No Service instances found in the database.")

        feedback_instance = Feedback.objects.create(
            content=feedback.get('content'),
            rating=feedback.get('rating'),
            user=random_senior_citizen  
        )

        # Add ManyToMany relationships
        feedback_instance.employees.add(random_employee)
        feedback_instance.services.add(random_service)

        feedbacks.append(feedback_instance)

    print("Feedback seeding completed successfully.")
    return feedbacks

def create_test_results(feedbacks):
    tests = list(SentimentTest.objects.all())
    if not tests:
        raise ValueError("No SentimentTest instances found in the database.")

    for feedback in feedbacks:
        try:
            if not SentimentResult.objects.filter(feedback=feedback).exists():
                test = random.choice(tests)
                mode = 'anew'
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

                SentimentResult.objects.create(
                    mode=mode,
                    score=analysis['score'],
                    sentiment=analysis['sentiment'],
                    words=words,
                    details=details,
                    feedback=feedback,
                    sentiment_test=test
                )
        except Exception as e:
            continue
        
    print("Test results creation completed successfully.")

@transaction.atomic
def run():
    feedbacks = create_feedbacks()
    create_test_results(feedbacks)