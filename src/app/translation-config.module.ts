import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import localeUk from '@angular/common/locales/uk';
import localeHu from '@angular/common/locales/hu';
import localeEn from '@angular/common/locales/en';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslationLoaderService } from './services';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

registerLocaleData(localeEn, 'en-US');
registerLocaleData(localeUk, 'uk-UA');
registerLocaleData(localeHu, 'hu-HU');

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    TranslationLoaderService,
    {
      provide: APP_INITIALIZER,
      useFactory: (translationLoader: TranslationLoaderService) => () => translationLoader.loadTranslation(),
      deps: [TranslationLoaderService],
      multi: true,
    },
    {
      provide: LOCALE_ID,
      deps: [TranslateService],
      useFactory: (translate: TranslateService) => translate.currentLang || translate.defaultLang,
    },
  ],
})
export class TranslationConfigModule {}
