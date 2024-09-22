import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocaleService, StorageService } from '../../services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Visit } from '../../models';
import { firstValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-treatment-page',
  templateUrl: './treatment-page.component.html',
  styleUrl: './treatment-page.component.scss',
})
export class TreatmentPageComponent  implements OnInit {
  visit: Visit;

  private filesStoragePath: string;

  get currentLanguage(): string {
    return this.localeService.currentLanguage;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly storageService: StorageService,
    private readonly destroyRef: DestroyRef,
    private readonly localeService: LocaleService,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit(): void {
    const visitId = this.route.snapshot.params['id'];

    this.storageService.getVisitById(visitId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((visit: Visit) => {
        this.visit = visit;
      });
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
