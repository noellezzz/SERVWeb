from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = "An example command to demonstrate how to create custom management commands"

    def add_arguments(self, parser):
        parser.add_argument('name', type=str, help='Name of the person to greet')

    def handle(self, *args, **kwargs):
        name = kwargs['name']
        self.stdout.write(self.style.SUCCESS(f'Hello, {name}!'))
