import { Component, signal, computed, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { PosthogService } from '@app/services/posthog.service';

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
export class BillingComponent implements OnInit {
  private readonly posthogService = inject(PosthogService);

  readonly currentPlan = signal('starter');

  ngOnInit() {
    this.posthogService.posthog.capture('billing_viewed', {
      current_plan: this.currentPlan(),
    });
  }

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
}
