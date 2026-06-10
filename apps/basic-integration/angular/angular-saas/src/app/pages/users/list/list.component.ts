import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { UseRandomUser } from '@core/usecases';
import { RandomUserEntity } from '@core/entities';
import { HotToastService } from '@ngxpert/hot-toast';
import { PostHogService } from '@app/@core/services';

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
  private readonly _posthog = inject(PostHogService);

  ngOnInit() {
    this.useRandomUser.getAllUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  userClicked() {
    this._posthog.capture('user_viewed');
    this.toast.show('User clicked');
  }
}
