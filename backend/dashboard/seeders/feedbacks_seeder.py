import os
import json
import random
from feedbacks.models import Feedback
from dashboard.seeders._seeder import Seeder

DATA_PATH = os.path.join(os.path.dirname(__file__), 'data/reviews.json')

def run():
    with open(DATA_PATH, 'r') as file:
        data = json.load(file)
    
    random.shuffle(data)
    selected_data = data[:500]
    
    selected_data = [{k: v for k, v in item.items() if k != 'rating'} for item in selected_data]
    
    seeder = Seeder(model=Feedback, data=selected_data)
    seeder.seed()