from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Count, Sum
from .models import Plan, Subscription


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ['name', 'price_display', 'interval', 'subscriber_count', 'is_active', 'is_featured', 'sort_order']
    list_filter = ['is_active', 'is_featured', 'interval']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['sort_order', 'price']
    search_fields = ['name', 'slug']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        (None, {
            'fields': ('name', 'slug', 'description')
        }),
        ('Pricing', {
            'fields': ('price', 'currency', 'interval')
        }),
        ('Features', {
            'fields': ('features',),
            'description': 'Enter features as a JSON array: ["Feature 1", "Feature 2"]'
        }),
        ('Display', {
            'fields': ('is_active', 'is_featured', 'sort_order')
        }),
        ('Stripe', {
            'fields': ('stripe_price_id',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def price_display(self, obj):
        return obj.get_price_display()
    price_display.short_description = 'Price'

    def subscriber_count(self, obj):
        count = obj.subscriptions.filter(status='active').count()
        return format_html('<strong>{}</strong>', count)
    subscriber_count.short_description = 'Active Subscribers'

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(
            active_subs=Count('subscriptions', filter=models.Q(subscriptions__status='active'))
        )


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['user', 'plan', 'status_badge', 'current_period_start', 'current_period_end', 'is_demo']
    list_filter = ['status', 'plan', 'created_at']
    search_fields = ['user__username', 'user__email', 'stripe_subscription_id']
    raw_id_fields = ['user']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'

    fieldsets = (
        (None, {
            'fields': ('user', 'plan', 'status')
        }),
        ('Billing Period', {
            'fields': ('current_period_start', 'current_period_end', 'canceled_at')
        }),
        ('Stripe', {
            'fields': ('stripe_subscription_id', 'stripe_customer_id'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def status_badge(self, obj):
        colors = {
            'active': '#28a745',
            'canceled': '#dc3545',
            'past_due': '#ffc107',
            'trialing': '#17a2b8',
            'paused': '#6c757d',
        }
        color = colors.get(obj.status, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 8px; border-radius: 3px;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    def is_demo(self, obj):
        if obj.stripe_subscription_id and obj.stripe_subscription_id.startswith('sub_demo_'):
            return format_html('<span style="color: #6c757d;">Demo</span>')
        return format_html('<span style="color: #28a745;">Live</span>')
    is_demo.short_description = 'Mode'

    actions = ['mark_as_canceled', 'mark_as_active']

    def mark_as_canceled(self, request, queryset):
        from django.utils import timezone
        updated = queryset.update(status='canceled', canceled_at=timezone.now())
        self.message_user(request, f'{updated} subscription(s) marked as canceled.')
    mark_as_canceled.short_description = 'Mark selected as canceled'

    def mark_as_active(self, request, queryset):
        updated = queryset.update(status='active', canceled_at=None)
        self.message_user(request, f'{updated} subscription(s) marked as active.')
    mark_as_active.short_description = 'Mark selected as active'


# Import models for use in admin queryset
from django.db import models
