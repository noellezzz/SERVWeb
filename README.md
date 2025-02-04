# SERV - Service Evaluation and Report Visualization

## Installation

**1. Frontend**


___


**2. Backend**
```bash
cd backend
python -m virtualenv .venv
.venv\Scripts\activate        # in windows
# .venv\bin\activate.ps1        # in windows
# source .venv/bin/activate     # in linux
pip install -r requirements.txt

# django setup
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 5000

```