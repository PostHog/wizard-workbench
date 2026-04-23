import { Component, OnInit, ChangeDetectionStrategy, inject, signal, DestroyRef } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { environment } from '@env/environment';
import { NavMode, ShellService } from '@app/shell/services/shell.service';
import { webSidebarMenuItems } from '@core/constants';
import { CredentialsService } from '@app/auth/services/credentials.service';
import { NavMenuItem } from '@core/interfaces';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [RouterLink, RouterLinkActive, TranslateModule, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly credentialsService = inject(CredentialsService);
  private readonly destroyRef = inject(DestroyRef);
  readonly shellService = inject(ShellService);

  readonly version = environment.version;
  readonly year = environment.buildYear ?? 2024;
  sidebarItems: NavMenuItem[] = webSidebarMenuItems;
  readonly sidebarExtendedItem = signal(-1);
  readonly navExpanded = signal(true);

  ngOnInit(): void {
    this.shellService.activeNavTab(this.sidebarItems, this.sidebarExtendedItem());

    this.router.events
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((event) => event instanceof NavigationEnd),
      )
      .subscribe(() => {
        this.shellService.activeNavTab(this.sidebarItems, this.sidebarExtendedItem());
      });

    this.shellService.navMode$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((mode) => {
      this.navExpanded.set(mode === NavMode.Free);
    });
  }

  toggleSidebar(isEnterEvent: boolean): void {
    const mode = this.shellService.navMode();
    if (isEnterEvent) {
      this.navExpanded.set(true);
    } else if (!isEnterEvent && mode === NavMode.Free) {
      this.navExpanded.set(false);
    }
  }

  activateSidebarItem(index: number): void {
    const item = this.sidebarItems[index];
    if (item.disabled) return;

    if (index !== this.sidebarExtendedItem()) {
      this.sidebarExtendedItem.set(index);
    } else {
      this.sidebarExtendedItem.set(-1);
    }

    this.shellService.activateNavItem(index, this.sidebarItems);
  }

  activateSidebarSubItem(index: number, subItem: NavMenuItem): void {
    this.shellService.activateNavSubItem(index, subItem, this.sidebarItems);
  }
}
