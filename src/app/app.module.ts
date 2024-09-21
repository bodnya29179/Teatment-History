import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import localeUk from '@angular/common/locales/uk';
import localeHu from '@angular/common/locales/hu';
import localeEn from '@angular/common/locales/en';
import { AppComponent } from './app.component';
import { AddVisitComponent, TreatmentHistoryComponent, LanguageComponent } from './components';
import { VisitService, TranslationLoaderService, StorageService } from './services';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

registerLocaleData(localeEn, 'en-US');
registerLocaleData(localeUk, 'uk-UA');
registerLocaleData(localeHu, 'hu-HU');

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [
    AppComponent,
    AddVisitComponent,
    TreatmentHistoryComponent,
    LanguageComponent,
  ],
  providers: [
    VisitService,
    TranslationLoaderService,
    StorageService,
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
  bootstrap: [AppComponent],
})
export class AppModule {}
