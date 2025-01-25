import uuid
from django.db import models
from django.urls import reverse


class SentimentResult(models.Model):

    # Fields
    created = models.DateTimeField(auto_now_add=True, editable=False)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    last_updated = models.DateTimeField(auto_now=True, editable=False)

    class Meta:
        pass

    def __str__(self):
        return str(self.pk)

    def get_absolute_url(self):
        return reverse("sentiment_tests_SentimentResult_detail", args=(self.pk,))

    def get_update_url(self):
        return reverse("sentiment_tests_SentimentResult_update", args=(self.pk,))



class SentimentTest(models.Model):

    # Fields
    created = models.DateTimeField(auto_now_add=True, editable=False)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    last_updated = models.DateTimeField(auto_now=True, editable=False)

    class Meta:
        pass

    def __str__(self):
        return str(self.pk)

    def get_absolute_url(self):
        return reverse("sentiment_tests_SentimentTest_detail", args=(self.pk,))

    def get_update_url(self):
        return reverse("sentiment_tests_SentimentTest_update", args=(self.pk,))

