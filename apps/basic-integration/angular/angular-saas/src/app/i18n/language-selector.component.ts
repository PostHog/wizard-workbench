import { Component, ElementRef, input, inject, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { I18nService } from './i18n.service';
import { PosthogService } from '@core/services';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onClickOutside($event)',
  },
})
export class LanguageSelectorComponent {
  private readonly i18nService = inject(I18nService);
  private readonly eRef = inject(ElementRef);
  private readonly posthogService = inject(PosthogService);

  inNavbar = input(true);
  openAbove = input(false);
  isDropdownOpen = signal(false);

  readonly currentLanguageCode = computed(() => {
    const language = this.i18nService.currentLanguage();
    const parts = language.split('-');
    return parts.length > 1 ? parts[1] : '';
  });

  readonly languages = computed(() => this.i18nService.supportedLanguages());

  onClickOutside(event: Event) {
    if (!this.eRef?.nativeElement?.contains(event.target)) {
      this.isDropdownOpen.set(false);
    }
  }

  toggleDropdown() {
    this.isDropdownOpen.update((v) => !v);
  }

  setLanguage(language: string) {
    const previousLanguage = this.i18nService.currentLanguage();
    this.i18nService.setLanguage(language);
    this.posthogService.client.capture('language_changed', {
      previous_language: previousLanguage,
      selected_language: language,
    });
    this.isDropdownOpen.set(false);
  }

  getLanguageCode(language: string): string {
    const parts = language.split('-');
    return parts.length > 1 ? parts[1] : '';
  }
}
