import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocaleService } from '../../services';
import { Language } from '../../models';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
})
export class LanguageComponent {
  get currentLanguage(): string {
    return this.translate.defaultLang;
  }

  readonly languages = [
    { value: 'en-US', label: '🇬🇧 Eng' },
    { value: 'uk-UA', label: '🇺🇦 Укр' },
    { value: 'hu-HU', label: '🇭🇺 Mag' },
  ];

  constructor(
    private readonly translate: TranslateService,
    private readonly localeService: LocaleService,
  ) {}

  changeLanguage(event: Event): void {
    const language = (event.target as HTMLSelectElement).value as Language;

    this.localeService.setLanguage(language);
  }
}
