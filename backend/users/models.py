from django.db import models
from django.contrib.auth.models import AbstractUser
from dashboard.models import Service

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('employee', 'Employee'),
        ('user', 'User'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user', null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')] , null=True, blank=True)
    address = models.TextField( null=True, blank=True)
    contact_number = models.CharField(max_length=20, null=True, blank=True)


class SeniorCitizenInfo(models.Model):
    """Model for storing senior citizen information"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nid = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.user.username
    
    
class EmployeeInfo(models.Model):
    """Model for storing employee information"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    employee_id = models.CharField(max_length=20)
    score = models.IntegerField()
    services = models.ManyToManyField(Service, related_name='employeeinfo', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.user.username
    

    
    
    