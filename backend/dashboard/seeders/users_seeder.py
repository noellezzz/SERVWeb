import os
import json
import random
from django.core.exceptions import ObjectDoesNotExist
from users.models import User, BasicInformation, EmployeeInfo
from dashboard.models import Service

# Define the paths to your JSON data files
USER_DATA_PATH = os.path.join(os.path.dirname(__file__), 'data/users.json')
EMPLOYEE_DATA_PATH = os.path.join(os.path.dirname(__file__), 'data/employees.json')

def run():
    """Seed the database with user and employee data from JSON files."""
    with open(USER_DATA_PATH, 'r') as user_file:
        user_data = json.load(user_file)
    
    with open(EMPLOYEE_DATA_PATH, 'r') as employee_file:
        employee_data = json.load(employee_file)
    
    # Create Users and Basic Information
    for user in user_data:
        user_instance, created = User.objects.get_or_create(
            username=user['username'],
            defaults={
                'email': user['email'],
                'role': user['role'],
            }
        )
        BasicInformation.objects.get_or_create(
            user=user_instance,
            defaults={
                'first_name': user['first_name'],
                'last_name': user['last_name'],
                'date_of_birth': user['date_of_birth'],
                'gender': user['gender'],
                'contact_number': user['contact_number'],
                'address': user['address'],
            }
        )
    
    # Fetch all available services
    available_services = list(Service.objects.all())
    
    # Create EmployeeInfo and assign a random service if available
    for employee in employee_data:
        try:
            user_instance = User.objects.get(username=employee['username'])
            employee_instance, created = EmployeeInfo.objects.get_or_create(
                user=user_instance,
                defaults={
                    'employee_id': employee['employee_id'],
                    'score': employee['score'],
                }
            )

            # Assign a random service if services exist
            if available_services:
                random_service = random.choice(available_services)
                employee_instance.services.add(random_service)
                print(f"Assigned {random_service} to {user_instance.username}")

        except ObjectDoesNotExist:
            print(f"User {employee['username']} not found, skipping...")
