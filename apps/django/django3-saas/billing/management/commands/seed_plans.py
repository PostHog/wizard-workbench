from django.core.management.base import BaseCommand
from billing.models import Plan


class Command(BaseCommand):
    help = 'Seed the database with demo pricing plans'

    def handle(self, *args, **options):
        plans_data = [
            {
                'name': 'Starter',
                'slug': 'starter',
                'description': 'Perfect for individuals and small projects.',
                'price': 0,
                'interval': 'month',
                'features': [
                    '1 project',
                    '1,000 API requests/month',
                    'Community support',
                    'Basic analytics',
                ],
                'is_active': True,
                'is_featured': False,
                'sort_order': 1,
                'stripe_price_id': '',
            },
            {
                'name': 'Growth',
                'slug': 'growth',
                'description': 'For growing teams that need more power.',
                'price': 29,
                'interval': 'month',
                'features': [
                    '10 projects',
                    '50,000 API requests/month',
                    'Email support',
                    'Advanced analytics',
                    'Team collaboration',
                ],
                'is_active': True,
                'is_featured': True,
                'sort_order': 2,
                'stripe_price_id': 'price_growth_monthly',
            },
            {
                'name': 'Scale',
                'slug': 'scale',
                'description': 'For businesses that need unlimited scale.',
                'price': 99,
                'interval': 'month',
                'features': [
                    'Unlimited projects',
                    'Unlimited API requests',
                    'Priority support',
                    'Custom analytics',
                    'Team collaboration',
                    'SSO integration',
                    'Dedicated account manager',
                ],
                'is_active': True,
                'is_featured': False,
                'sort_order': 3,
                'stripe_price_id': 'price_scale_monthly',
            },
        ]

        for plan_data in plans_data:
            plan, created = Plan.objects.update_or_create(
                slug=plan_data['slug'],
                defaults=plan_data
            )
            status = 'Created' if created else 'Updated'
            self.stdout.write(f'{status}: {plan.name}')

        self.stdout.write(self.style.SUCCESS('Successfully seeded plans'))
