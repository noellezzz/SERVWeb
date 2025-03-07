import os
import json
import random
from django.core.exceptions import ObjectDoesNotExist
from users.models import User, EmployeeInfo, SeniorCitizenInfo
from dashboard.models import Service

# Define the path to your JSON data file
USER_DATA_PATH = os.path.join(os.path.dirname(__file__), 'data/users.json')

def run():
    """Seed the database with user and employee data from JSON files."""
    with open(USER_DATA_PATH, 'r') as user_file:
        user_data = json.load(user_file)
    
    # Create Users and Basic Information
    for user in user_data:
        user_instance, created = User.objects.get_or_create(
            username=user['username'],
            defaults={
                'email': user['email'],
                'role': user['role'],
                'first_name': user['first_name'],
                'last_name': user['last_name'],
                'date_of_birth': user.get('date_of_birth'),
                'gender': user.get('gender'),
                'contact_number': user.get('contact_number'),
                'address': user.get('address'),
            }
        )

        # Create EmployeeInfo if present
        if 'employee_info' in user:
            EmployeeInfo.objects.get_or_create(
                user=user_instance,
                defaults={
                    'employee_id': user['employee_info']['employee_id'],
                    'score': user['employee_info']['score'],
                }
            )

        # Create SeniorCitizenInfo if present
        if 'senior_info' in user:
            SeniorCitizenInfo.objects.get_or_create(
                user=user_instance,
                defaults={
                    'nid': user['senior_info']['nid'],
                }
            )
    
    # Fetch all available services
    available_services = list(Service.objects.all())
    
    # Assign a random service to each employee if services exist
    for user in user_data:
        if user['role'] == 'employee':
            try:
                user_instance = User.objects.get(username=user['username'])
                employee_instance = EmployeeInfo.objects.get(user=user_instance)

                # Assign a random service if services exist
                if available_services:
                    random_service = random.choice(available_services)
                    employee_instance.services.add(random_service)
                    print(f"Assigned {random_service} to {user_instance.username}")

            except ObjectDoesNotExist:
                print(f"User {user['username']} not found, skipping...")

