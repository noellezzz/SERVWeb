from django.db import models
from django.urls import reverse
from django.conf import settings
from users.models import EmployeeInfo, SeniorCitizenInfo, User
from dashboard.models import Service


class Feedback(models.Model):
    id = models.AutoField(primary_key=True)
    created = models.DateTimeField(auto_now_add=True, editable=False)
    last_updated = models.DateTimeField(auto_now=True, editable=False)
    
    
    content = models.TextField(blank=True, null=True)
    rating = models.IntegerField(blank=True, null=True)

    user = models.ForeignKey(SeniorCitizenInfo, on_delete=models.SET_NULL, blank=True, null=True, related_name='seniorcitizeninfo')
    employees = models.ManyToManyField(EmployeeInfo, related_name='employeeinfo', blank=True)
    services = models.ManyToManyField(Service, related_name='services', blank=True)
    
    class Meta:
        pass

    def __str__(self):
        return str(self.pk)

    def get_absolute_url(self):
        return reverse("feedbacks_Feedback_detail", args=(self.pk,))

    def get_update_url(self):
        return reverse("feedbacks_Feedback_update", args=(self.pk,))

