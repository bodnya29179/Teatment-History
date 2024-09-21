import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Language } from '../models';
import { LocaleService } from './locale.service';

@Injectable()
export class TranslationLoaderService {
  constructor(
    private readonly http: HttpClient,
    private readonly translate: TranslateService,
    private readonly localeService: LocaleService,
  ) {
    this.setupLanguage();
  }

  loadTranslation(): Observable<any> {
    return this.http.get(`./assets/i18n/${ this.translate.currentLang }.json`);
  }

  private setupLanguage(): void {
    this.translate.addLangs(Object.values(Language));

    const locale = this.localeService.localeLanguage;

    if (locale) {
      this.translate.setDefaultLang(locale);
      this.translate.use(locale);
    } else {
      this.localeService.setLanguage(Language.ua);
    }
  }
}
