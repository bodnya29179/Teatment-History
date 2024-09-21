import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(private readonly translate: TranslateService) {}

  changeLanguage(event: Event): void {
    const language = (event.target as HTMLSelectElement).value;

    this.translate.use(language);
    this.translate.setDefaultLang(language);
    localStorage.setItem('locale', language);
  }
}
