import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { PostHogService } from '@core/services';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  recommended: boolean;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
}

@Component({
  selector: 'app-billing',
  imports: [TitleCasePipe],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingComponent {
  private readonly posthogService = inject(PostHogService);
  readonly currentPlan = signal('starter');

  readonly plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'month',
      features: ['Up to 5 users', '1 project', 'Basic support', '1GB storage'],
      recommended: false,
    },
    {
      id: 'starter',
      name: 'Starter',
      price: 29,
      period: 'month',
      features: ['Up to 25 users', '10 projects', 'Priority support', 'API access', '10GB storage'],
      recommended: true,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 99,
      period: 'month',
      features: ['Unlimited users', 'Unlimited projects', '24/7 support', 'Advanced analytics', 'Custom integrations', '100GB storage'],
      recommended: false,
    },
  ];

  readonly invoices: Invoice[] = [
    { id: 'INV-001', date: 'Feb 1, 2024', amount: 29, status: 'paid' },
    { id: 'INV-002', date: 'Jan 1, 2024', amount: 29, status: 'paid' },
    { id: 'INV-003', date: 'Dec 1, 2023', amount: 29, status: 'paid' },
    { id: 'INV-004', date: 'Nov 1, 2023', amount: 29, status: 'paid' },
  ];

  readonly currentPlanDetails = computed(() => this.plans.find((p) => p.id === this.currentPlan()));

  selectPlan(plan: Plan): void {
    if (plan.id === this.currentPlan()) return;
    this.posthogService.posthog.capture('plan_upgrade_clicked', {
      plan_id: plan.id,
      plan_name: plan.name,
      plan_price: plan.price,
      current_plan: this.currentPlan(),
    });
    this.currentPlan.set(plan.id);
  }
}
