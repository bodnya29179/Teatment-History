import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslationConfigModule } from './translation-config.module';
import { AppComponent } from './app.component';
import { AddVisitComponent, TreatmentHistoryComponent, LanguageComponent } from './components';
import { VisitService, StorageService } from './services';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslationConfigModule,
    TranslateModule,
  ],
  declarations: [
    AppComponent,
    AddVisitComponent,
    TreatmentHistoryComponent,
    LanguageComponent,
  ],
  providers: [
    VisitService,
    StorageService,
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
