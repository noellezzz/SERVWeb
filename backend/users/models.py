from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class BasicInformation(models.Model):
    """Model for storing basic information"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')])
    contact_number = models.CharField(max_length=20)
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class SeniorCitizenInfo(models.Model):
    """Model for storing senior citizen information"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nid = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    
    
class EmployeeInfo(models.Model):
    """Model for storing employee information"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    employee_id = models.CharField(max_length=20)
    score = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    

    
    
    