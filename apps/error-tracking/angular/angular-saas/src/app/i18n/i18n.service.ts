import { DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

import enUS from '../../translations/en-US.json';
import { Logger } from '@app/@core/services';
import { environment } from '@env/environment';

const log = new Logger('I18nService');
const languageKey = 'language';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  private readonly translateService = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  /** Current language signal */
  readonly currentLanguage = signal<string>(localStorage.getItem(languageKey) || environment.defaultLanguage || this.translateService.getBrowserCultureLang() || '');

  /** Default language */
  readonly defaultLanguage = signal<string>('');

  /** Supported languages */
  readonly supportedLanguages = signal<string[]>([]);

  constructor() {
    // Embed English translation
    this.translateService.setTranslation('en-US', enUS);

    // Effect to persist language changes to localStorage
    effect(() => {
      const lang = this.currentLanguage();
      if (lang) {
        localStorage.setItem(languageKey, lang);
      }
    });
  }

  /**
   * Gets the current language from TranslateService.
   * @return The current language code.
   */
  get language(): string {
    return this.translateService.currentLang;
  }

  /**
   * Sets the current language.
   * Note: The current language is saved to the local storage.
   * If no parameter is specified, the language is loaded from local storage (if present).
   * @param language The IETF language code to set.
   */
  setLanguage(language: string): void {
    let newLanguage = language || localStorage.getItem(languageKey) || environment.defaultLanguage || this.translateService.getBrowserCultureLang() || '';
    let isSupportedLanguage = this.supportedLanguages().includes(newLanguage);

    // If no exact match is found, search without the region
    if (newLanguage && !isSupportedLanguage) {
      const langPrefix = newLanguage.split('-')[0];
      newLanguage = this.supportedLanguages().find((supportedLanguage) => supportedLanguage.startsWith(langPrefix)) || '';
      isSupportedLanguage = Boolean(newLanguage);
    }

    // Fallback if language is not supported
    if (!newLanguage || !isSupportedLanguage) {
      newLanguage = this.defaultLanguage();
    }

    if (newLanguage !== this.currentLanguage()) {
      this.currentLanguage.set(newLanguage);
    }

    log.debug(`Language set to ${newLanguage}`);
    this.translateService.use(newLanguage);
  }

  /**
   * Initializes i18n for the application.
   * Loads language from local storage if present, or sets default language.
   * @param defaultLanguage The default language to use.
   * @param supportedLanguages The list of supported languages.
   */
  init(defaultLanguage: string, supportedLanguages: string[]) {
    this.defaultLanguage.set(defaultLanguage);
    this.supportedLanguages.set(supportedLanguages);
    log.debug(`Initializing with default language: ${defaultLanguage}`);
    this.setLanguage('');

    // Subscribe to language changes from TranslateService
    this.translateService.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event: LangChangeEvent) => {
      if (event.lang !== this.currentLanguage()) {
        this.currentLanguage.set(event.lang);
      }
    });
  }

  /**
   * @deprecated Use init() which handles cleanup automatically via DestroyRef
   */
  destroy() {
    // No longer needed - DestroyRef handles cleanup automatically
  }
}
