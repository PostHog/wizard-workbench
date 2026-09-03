from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Plan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('slug', models.SlugField(unique=True)),
                ('description', models.TextField(blank=True)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('currency', models.CharField(default='USD', max_length=3)),
                ('interval', models.CharField(choices=[('month', 'Monthly'), ('year', 'Yearly')], default='month', max_length=20)),
                ('features', models.JSONField(default=list)),
                ('is_active', models.BooleanField(default=True)),
                ('is_featured', models.BooleanField(default=False)),
                ('sort_order', models.IntegerField(default=0)),
                ('stripe_price_id', models.CharField(blank=True, max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['sort_order', 'price'],
            },
        ),
        migrations.CreateModel(
            name='Subscription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('active', 'Active'), ('canceled', 'Canceled'), ('past_due', 'Past Due'), ('trialing', 'Trialing'), ('paused', 'Paused')], default='active', max_length=20)),
                ('current_period_start', models.DateTimeField()),
                ('current_period_end', models.DateTimeField()),
                ('canceled_at', models.DateTimeField(blank=True, null=True)),
                ('stripe_subscription_id', models.CharField(blank=True, max_length=100)),
                ('stripe_customer_id', models.CharField(blank=True, max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('plan', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='subscriptions', to='billing.plan')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='subscriptions', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
