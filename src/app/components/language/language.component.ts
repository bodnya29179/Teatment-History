import { Component } from '@angular/core';
import { LocaleService } from '../../services';
import { Language } from '../../models';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrl: './language.component.scss',
})
export class LanguageComponent {
  get currentLanguage(): string {
    return this.localeService.currentLanguage;
  }

  readonly languages = [
    { value: 'en-US', label: '🇬🇧 Eng' },
    { value: 'uk-UA', label: '🇺🇦 Укр' },
    { value: 'hu-HU', label: '🇭🇺 Mag' },
  ];

  constructor(private readonly localeService: LocaleService) {}

  changeLanguage(event: Event): void {
    const language = (event.target as HTMLSelectElement).value as Language;

    this.localeService.setLanguage(language);
  }
}
