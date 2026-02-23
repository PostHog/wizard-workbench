import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { UseRandomUser } from '@core/usecases';
import { RandomUserEntity } from '@core/entities';
import { HotToastService } from '@ngxpert/hot-toast';
import { PostHogService } from '@app/services/posthog.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit {
  readonly users = signal<RandomUserEntity[]>([]);
  readonly isLoading = signal(true);

  private readonly useRandomUser = new UseRandomUser();
  private readonly toast = inject(HotToastService);
  private readonly posthogService = inject(PostHogService);

  ngOnInit() {
    this.posthogService.posthog.capture('user_list_viewed');
    this.useRandomUser.getAllUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.posthogService.posthog.capture('$exception', {
          $exception_message: error?.message || 'Failed to load users',
          $exception_type: error?.name || 'UserLoadError',
        });
      },
    });
  }

  userClicked() {
    this.toast.show('User clicked');
  }
}
