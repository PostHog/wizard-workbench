import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { UseRandomUser } from '@core/usecases';
import { RandomUserEntity } from '@core/entities';
import { HotToastService } from '@ngxpert/hot-toast';
import { PosthogService } from '@core/services';

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
  private readonly posthogService = inject(PosthogService);

  ngOnInit() {
    this.useRandomUser.getAllUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoading.set(false);
        this.posthogService.posthog.capture('user_list_loaded', {
          user_count: users.length,
        });
      },
      error: (error) => {
        console.error(error);
        this.posthogService.posthog.capture('$exception', {
          $exception_message: error?.message || 'Failed to load user list',
          $exception_type: 'UserListLoadError',
        });
      },
    });
  }

  userClicked() {
    this.posthogService.posthog.capture('user_clicked');
    this.toast.show('User clicked');
  }
}
