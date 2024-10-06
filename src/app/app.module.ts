import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationConfigModule } from './translation-config.module';
import { AppComponent } from './app.component';
import {
  VisitFormComponent,
  TreatmentHistoryComponent,
  LanguageComponent,
  TreatmentPageComponent,
  HomePageComponent,
  BreadcrumbComponent,
} from './components';
import { VisitService, StorageService, LocaleService, IpcService } from './services';
import { Route, RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

const routes: Route[] = [
  { path: '', component: HomePageComponent },
  { path: ':id', component: TreatmentPageComponent },
];

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslationConfigModule,
    TranslateModule,
    RouterModule.forRoot(routes),
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
  ],
  declarations: [
    AppComponent,
    VisitFormComponent,
    TreatmentHistoryComponent,
    LanguageComponent,
    HomePageComponent,
    TreatmentPageComponent,
    BreadcrumbComponent,
  ],
  providers: [
    VisitService,
    StorageService,
    DatePipe,
    LocaleService,
    IpcService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
