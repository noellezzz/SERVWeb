import uuid
from django.db import models
from django.urls import reverse


class Queue(models.Model):

    # Fields
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created = models.DateTimeField(auto_now_add=True, editable=False)
    last_updated = models.DateTimeField(auto_now=True, editable=False)

    class Meta:
        pass

    def __str__(self):
        return str(self.pk)

    def get_absolute_url(self):
        return reverse("queues_Queue_detail", args=(self.pk,))

    def get_update_url(self):
        return reverse("queues_Queue_update", args=(self.pk,))

