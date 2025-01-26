import uuid
from django.db import models
from django.urls import reverse
from django.conf import settings

class Feedback(models.Model):
    created = models.DateTimeField(auto_now_add=True, editable=False)
    last_updated = models.DateTimeField(auto_now=True, editable=False)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    content = models.TextField(blank=True, null=True)
    user_nid = models.TextField(blank=True, null=True)
    
    class Meta:
        pass

    def __str__(self):
        return str(self.pk)

    def get_absolute_url(self):
        return reverse("feedbacks_Feedback_detail", args=(self.pk,))

    def get_update_url(self):
        return reverse("feedbacks_Feedback_update", args=(self.pk,))

