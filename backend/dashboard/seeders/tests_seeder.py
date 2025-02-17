import os 
import json
from sentiment_tests.models import SentimentTest
from dashboard.seeders._seeder import Seeder

DATA_PATH = os.path.join(os.path.dirname(__file__), 'data/questions.json')

def run():
    with open(DATA_PATH, 'r') as file:
        data = json.load(file)
    
    seeder = Seeder(model=SentimentTest, data=data)
    seeder.seed()

