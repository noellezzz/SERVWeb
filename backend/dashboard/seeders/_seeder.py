from django.db import transaction

class Seeder:
    def __init__(self, model, data):
        self.model = model
        self.data = data

    @transaction.atomic
    def seed(self):
        instances = [self.model(**item) for item in self.data]
        self.model.objects.bulk_create(instances)
