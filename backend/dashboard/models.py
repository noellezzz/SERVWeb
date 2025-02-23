from django.db import models
from django.urls import reverse


# Services Model
class Service(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=100, blank=True, null=True)
    image = models.ImageField(upload_to='services', blank=True)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('service-detail', kwargs={'pk': self.pk})
    