import os
import json
from dashboard.models import Service

DATA_PATH = os.path.join(os.path.dirname(__file__), 'data/services.json')

def run():
    with open(DATA_PATH, 'r') as file:
        services_data = json.load(file)
        for service_data in services_data:
            Service.objects.create(**service_data)