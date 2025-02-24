from django.core.management.base import BaseCommand
from django.db import transaction
import importlib

class Command(BaseCommand):
    help = "Run specified seeder or all seeders sequentially and log the output"

    def add_arguments(self, parser):
        parser.add_argument(
            '--seeder',
            type=str,
            help='Specify the seeder to run (e.g., dashboard.seeders.feedbacks_seeder)'
        )

    def handle(self, *args, **kwargs):
        seeder_arg = kwargs['seeder']
        seeders = [
            'dashboard.seeders.tests_seeder',
            'dashboard.seeders.services_seeder',
            'dashboard.seeders.users_seeder',
            # 'dashboard.seeders.feedbacks_seeder',
            # 'dashboard.seeders.results_seeder'
        ]

        if seeder_arg:
            seeders = [seeder_arg]

        for seeder_path in seeders:
            module = importlib.import_module(seeder_path)
            self.stdout.write(self.style.SUCCESS(f'Running {seeder_path}...'))
            try:
                with transaction.atomic():
                    module.run()
                self.stdout.write(self.style.SUCCESS(f'Successfully ran {seeder_path}'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Error running {seeder_path}: {e}'))