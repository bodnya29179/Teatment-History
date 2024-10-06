import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, Observable } from 'rxjs';
import { IpcService, LocaleService, TreatmentFacadeService } from '../../services';
import { Visit } from '../../models';

@Component({
  selector: 'app-treatment-page',
  templateUrl: './treatment-page.component.html',
  styleUrl: './treatment-page.component.scss',
})
export class TreatmentPageComponent  implements OnInit {
  visit$: Observable<Visit>;

  isEditing = false;

  get currentLanguage(): string {
    return this.localeService.currentLanguage;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly localeService: LocaleService,
    private readonly translate: TranslateService,
    private readonly ipcService: IpcService,
    private readonly treatmentFacadeService: TreatmentFacadeService,
  ) {}

  async ngOnInit(): Promise<void> {
    const visitId = this.route.snapshot.params['id'];

    this.treatmentFacadeService.loadVisit(visitId);
    this.visit$ = this.treatmentFacadeService.getVisitById(visitId);
  }

  getReportName(report: string): string {
    const lastDotIndex = report.lastIndexOf('.');
    const lastUnderlineIndex = report.lastIndexOf('_');
    const fileName = report.slice(0, lastUnderlineIndex);
    const fileFormat = report.slice(lastDotIndex + 1);

    return `${ fileName }.${ fileFormat }`;
  }

  openReport(fileName: string): void {
    if (this.ipcService.isElectronApp) {
      this.ipcService.openFile(fileName);
    } else {
      window.open(`http://localhost:3000/uploads/${ fileName }`, '_blank');
    }
  }

  toggleEditing(): void {
    this.isEditing = !this.isEditing;
  }

  async deleteVisit(): Promise<void> {
    const isConfirmed = confirm(this.translate.instant('visit.deleteConfirmation'));

    if (isConfirmed) {
      const visit = await firstValueFrom(this.visit$);

      this.treatmentFacadeService.deleteVisit(visit.id);
      this.router.navigate(['/']);
    }
  }
}
