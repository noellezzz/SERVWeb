import uuid
from django.db import models
from django.urls import reverse


class SentimentTest(models.Model):
    """Model for managing sentiment test questions"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question_text = models.TextField()
    category = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    
    created = models.DateTimeField(auto_now_add=True, editable=False)
    last_updated = models.DateTimeField(auto_now=True, editable=False)

    class Meta:
        pass

    def __str__(self):
        return str(self.pk)

    def get_absolute_url(self):
        return reverse("sentiment_tests_SentimentTest_detail", args=(self.pk,))

    def get_update_url(self):
        return reverse("sentiment_tests_SentimentTest_update", args=(self.pk,))


class SentimentResult(models.Model):

    """Model for storing sentiment analysis results"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)    
    created = models.DateTimeField(auto_now_add=True, editable=False)
    last_updated = models.DateTimeField(auto_now=True, editable=False)
    
    # Content Fields
    # TODO: REMOVE NULL VALUES
    label = models.TextField(blank=True, null=True)
    score = models.FloatField(blank=True, null=True)
    
    positive_words = models.JSONField(default=list)
    negative_words = models.JSONField(default=list)
    emotion_detected = models.CharField(max_length=20)

    
    # Relationship Fields    
    sentiment_test = models.ForeignKey(
        "sentiment_tests.SentimentTest",
        on_delete=models.CASCADE, related_name="sentiment_results",
        blank=True, null=True, default=None
    )    
    
    feedback = models.ForeignKey(
        "feedbacks.Feedback",
        on_delete=models.CASCADE, related_name="sentiment_results",
        blank=True, null=True, default=None
    )

    class Meta:
        pass

    def __str__(self):
        return str(self.pk)

    def get_absolute_url(self):
        return reverse("sentiment_tests_SentimentResult_detail", args=(self.pk,))

    def get_update_url(self):
        return reverse("sentiment_tests_SentimentResult_update", args=(self.pk,))


