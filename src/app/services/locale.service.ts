import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '../models';

const LOCALE_FIELD = 'locale';

@Injectable()
export class LocaleService {
  constructor(private readonly translate: TranslateService) {}

  get currentLanguage(): Language | undefined {
    return (this.translate.currentLang || this.translate.defaultLang || this.localeLanguage) as Language;
  }

  get localeLanguage(): Language | undefined {
    return localStorage.getItem(LOCALE_FIELD) as Language;
  }

  setLanguage(language: Language): void {
    this.translate.setDefaultLang(language);
    this.translate.use(language);
    document.documentElement.setAttribute('lang', language.split('-')[0]);
    localStorage.setItem(LOCALE_FIELD, language);
  }
}
