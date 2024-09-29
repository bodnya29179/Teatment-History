import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { LocaleService, StorageService } from '../../services';
import { Visit } from '../../models';

@Component({
  selector: 'app-treatment-page',
  templateUrl: './treatment-page.component.html',
  styleUrl: './treatment-page.component.scss',
})
export class TreatmentPageComponent  implements OnInit {
  visit: Visit;

  get currentLanguage(): string {
    return this.localeService.currentLanguage;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly storageService: StorageService,
    private readonly localeService: LocaleService,
    private readonly translate: TranslateService,
  ) {}

  async ngOnInit(): Promise<void> {
    const visitId = this.route.snapshot.params['id'];
    this.visit = await firstValueFrom(this.storageService.getVisitById(visitId));
  }

  getReportName(report: string): string {
    const lastDotIndex = report.lastIndexOf('.');
    const lastUnderlineIndex = report.lastIndexOf('_');
    const fileName = report.slice(0, lastUnderlineIndex);
    const fileFormat = report.slice(lastDotIndex + 1);

    return `${ fileName }.${ fileFormat }`;
  }

  getReportPath(fileName: string): string {
    return `http://localhost:3000/uploads/${ fileName }`;
  }

  deleteVisit(): void {
    const isConfirmed = confirm(this.translate.instant('visit.deleteConfirmation'));

    if (isConfirmed) {
      firstValueFrom(this.storageService.deleteVisit(this.visit.id));
      this.router.navigate(['/']);
    }
  }
}
