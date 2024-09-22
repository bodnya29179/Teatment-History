import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationConfigModule } from './translation-config.module';
import { AppComponent } from './app.component';
import {
  AddVisitComponent,
  TreatmentHistoryComponent,
  LanguageComponent,
  TreatmentPageComponent,
  HomePageComponent,
} from './components';
import { VisitService, StorageService, LocaleService } from './services';
import { Route, RouterModule } from '@angular/router';

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
  ],
  declarations: [
    AppComponent,
    AddVisitComponent,
    TreatmentHistoryComponent,
    LanguageComponent,
    HomePageComponent,
    TreatmentPageComponent,
  ],
  providers: [
    VisitService,
    StorageService,
    DatePipe,
    LocaleService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
