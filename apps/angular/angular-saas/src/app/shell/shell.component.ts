import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ShellService } from '@app/shell/services/shell.service';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  private readonly shellService = inject(ShellService);
  private readonly router = inject(Router);

  readonly isSidebarActive = signal(false);

  sidebarToggle(toggleState: boolean) {
    this.isSidebarActive.set(toggleState);
  }

  private reloadCurrentRoute(path?: string) {
    const currentUrl = path || this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
