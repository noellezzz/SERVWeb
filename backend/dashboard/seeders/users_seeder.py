import os 
import json
from users.models import User

USER_DATA_PATH = os.path.join(os.path.dirname(__file__), 'data/users.json')
EMPLOYEE_DATA_PATH = os.path.join(os.path.dirname(__file__), 'data/employees.json')
