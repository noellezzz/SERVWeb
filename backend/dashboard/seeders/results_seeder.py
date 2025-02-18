import random
import logging
from django.db import transaction
from feedbacks.models import Feedback
from sentiment_tests.models import SentimentTest, SentimentResult
from serv.utils.vader import ServSentimentAnalysis

DEFAULT_MODE = 'anew'
MAX_WORKERS = 10

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def analyze_feedback(feedback, test):
    ssa = ServSentimentAnalysis(feedback.content, mode=DEFAULT_MODE)
    analysis = ssa.analyze()
    words = ssa.get_words()
    mode = ssa.get_mode() 
    
    if SentimentResult.objects.filter(feedback=feedback, sentiment_test=test).exists():
        logger.info(f"Feedback {feedback.id} is already analyzed.")
        return
    
    
    with transaction.atomic():
        try:
            result = SentimentResult.objects.create(
                mode=mode,
                score=analysis['score'],
                sentiment=analysis['sentiment'],
                words=words,
                details={
                    'translated_text': analysis.get('translated_text', ''),
                    'prediction': {
                        'label': analysis.get('prediction', ''),
                        'score': analysis.get('prediction_score', 0)
                    },
                    'polarity': analysis.get('polarity', {})
                },
                feedback=feedback,
                sentiment_test=test
            )
            logger.info(f"Created result: {result.id}")
        except Exception as e:
            logger.error(f"Error creating result: {e}")
            return

def main():
    feedbacks = list(Feedback.objects.all())
    tests = list(SentimentTest.objects.all())

    if not feedbacks or not tests:
        logger.warning("No feedbacks or tests available to seed results.")
        return

    for _ in range(100):
        feedback = random.choice(feedbacks)
        test = random.choice(tests)
        analyze_feedback(feedback, test)

def run():
    main()

if __name__ == "__main__":
    run()