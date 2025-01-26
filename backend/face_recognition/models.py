import uuid
from django.db import models
from django.urls import reverse


class EmotionData(models.Model):

    # Fields
    last_updated = models.DateTimeField(auto_now=True, editable=False)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.UUIDField()
    created = models.DateTimeField(auto_now_add=True, editable=False)

    class Meta:
        pass

    def __str__(self):
        return str(self.pk)

    def get_absolute_url(self):
        return reverse("face_recognition_EmotionData_detail", args=(self.pk,))

    def get_update_url(self):
        return reverse("face_recognition_EmotionData_update", args=(self.pk,))

