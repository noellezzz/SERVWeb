import uuid
from django.db import models
from django.urls import reverse

class SentimentCategory(models.Model):
    """Model for managing sentiment test categories"""
    
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    
    created = models.DateTimeField(auto_now_add=True, editable=False)
    last_updated = models.DateTimeField(auto_now=True, editable=False)
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        pass

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("sentiment_tests_SentimentCategory_detail", args=(self.pk,))

    def get_update_url(self):
        return reverse("sentiment_tests_SentimentCategory_update", args=(self.pk,))


class SentimentTest(models.Model):
    """Model for managing sentiment test questions"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question_text_tl = models.TextField(blank=True, null=True)
    question_text_en = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=50, blank=True, null=True)
    options = models.JSONField(default=list, blank=True, null=True)
    is_active = models.BooleanField(default=True)

    title = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    
    created = models.DateTimeField(auto_now_add=True, editable=False)
    last_updated = models.DateTimeField(auto_now=True, editable=False)
    deleted_at = models.DateTimeField(blank=True, null=True)

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
    deleted_at = models.DateTimeField(blank=True, null=True)
    
    # Content Fields
    label = models.TextField(blank=True, null=True)
    score = models.FloatField(blank=True, null=True)
    positive_words = models.JSONField(default=list, blank=True, null=True)
    negative_words = models.JSONField(default=list, blank=True, null=True)
    detailed_results = models.JSONField(default=dict, blank=True, null=True)
    

    
    # Relationship Fields    
    sentiment_test = models.ForeignKey(
        "sentiment_tests.SentimentTest",
        on_delete=models.CASCADE,
        related_name="sentiment_results",
        null=True
    )    
    
    feedback = models.ForeignKey(
        "feedbacks.Feedback",
        on_delete=models.CASCADE,
        related_name="sentiment_results",
        null=True
    )

    class Meta:
        unique_together = ('sentiment_test', 'feedback')

    def __str__(self):
        return str(self.pk)

    def get_absolute_url(self):
        return reverse("sentiment_tests_SentimentResult_detail", args=(self.pk,))

    def get_update_url(self):
        return reverse("sentiment_tests_SentimentResult_update", args=(self.pk,))


