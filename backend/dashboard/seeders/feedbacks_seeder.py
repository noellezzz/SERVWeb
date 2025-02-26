import os
import json
import random
from feedbacks.models import Feedback
from dashboard.seeders._seeder import Seeder
from dashboard.models import Service
from users.models import User, SeniorCitizenInfo, EmployeeInfo

DATA_PATH = os.path.join(os.path.dirname(__file__), 'data/reviews.json')

def run():
    with open(DATA_PATH, 'r') as file:
        data = json.load(file)
    
    random.shuffle(data)
    selected_data = data[:50]

    for feedback in selected_data:
        random_senior_citizen = SeniorCitizenInfo.objects.order_by('?').first()
        if not random_senior_citizen:
            raise ValueError("No SeniorCitizenInfo instances found in the database.")

        random_employee = EmployeeInfo.objects.order_by('?').first()
        if not random_employee:
            raise ValueError("No EmployeeInfo instances found in the database.")

        random_service = Service.objects.order_by('?').first()
        if not random_service:
            raise ValueError("No Service instances found in the database.")

        feedback_instance = Feedback.objects.create(
            content=feedback.get('content'),
            rating=feedback.get('rating'),
            user=random_senior_citizen  
        )

        # Add ManyToMany relationships
        feedback_instance.employees.add(random_employee)
        feedback_instance.services.add(random_service)

    print("Feedback seeding completed successfully.")


