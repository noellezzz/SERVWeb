import uuid
from django.db import models
from django.urls import reverse


class Queue(models.Model):

    """Model for managing service queues"""


    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created = models.DateTimeField(auto_now_add=True, editable=False)
    last_updated = models.DateTimeField(auto_now=True, editable=False)

    # TODO: REMOVE NULL VALUES
    service_type = models.CharField(max_length=50, null=True, blank=True)
    queue_number = models.CharField(max_length=10, null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=[
        ('WAITING', 'Waiting'),
        ('SERVING', 'Serving'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ], default='WAITING')
    entry_time = models.DateTimeField(auto_now_add=False, editable=True, null=True, blank=True)
    service_start_time = models.DateTimeField(null=True, blank=True)
    service_end_time = models.DateTimeField(null=True, blank=True)

    class Meta:
        pass

    def __str__(self):
        return str(self.pk)

    def get_absolute_url(self):
        return reverse("queues_Queue_detail", args=(self.pk,))

    def get_update_url(self):
        return reverse("queues_Queue_update", args=(self.pk,))

