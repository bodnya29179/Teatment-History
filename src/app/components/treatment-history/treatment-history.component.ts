import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Visit } from '../../models';
import { StorageService } from '../../services';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-treatment-history',
  templateUrl: './treatment-history.component.html',
  styleUrl: './treatment-history.component.scss',
})
export class TreatmentHistoryComponent implements OnInit {
  visits$: Observable<Visit[]>;

  get currentLanguage(): string {
    return this.translate.defaultLang;
  }

  constructor(
    private readonly storageService: StorageService,
    private readonly router: Router,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.visits$ = this.storageService.getVisits();
  }

  showDetails(visitId: string): void {
    this.router.navigate([]); // TODO
  }
}

