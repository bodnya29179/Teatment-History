import { Component, OnInit } from '@angular/core';
import { Visit } from '../../models';
import { ActivatedRoute } from '@angular/router';
import { LocaleService, TreatmentFacadeService } from '../../services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent implements OnInit {
  visit$: Observable<Visit>;

  get currentLanguage(): string {
    return this.localeService.currentLanguage;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly localeService: LocaleService,
    private readonly treatmentFacadeService: TreatmentFacadeService,
  ) {}

  ngOnInit(): void {
    const visitId = this.route.snapshot.params['id'];
    this.visit$ = this.treatmentFacadeService.getVisitById(visitId);
  }
}
