import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable()
export class TranslationLoaderService {
  constructor(
    private http: HttpClient,
    private translate: TranslateService,
  ) {
    this.translate.addLangs(['en-US', 'hu-HU', 'uk-UA']);

    const locale = localStorage.getItem('locale');

    if (locale) {
      this.translate.setDefaultLang(locale);
      this.translate.use(locale);
    } else {
      this.translate.setDefaultLang('uk-UA');
      this.translate.use('uk-UA');
      localStorage.setItem('locale', 'uk-UA');
    }
  }

  loadTranslation(): Observable<any> {
    return this.http.get(`./assets/i18n/${ this.translate.currentLang }.json`);
  }
}
