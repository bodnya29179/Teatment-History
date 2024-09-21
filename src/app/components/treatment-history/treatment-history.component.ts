import { Component, DestroyRef, OnInit } from '@angular/core';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DoctorType, SortDirection, SortOption, Visit } from '../../models';
import { StorageService } from '../../services';
import { sortAlphabetically } from '../../utils';

@Component({
  selector: 'app-treatment-history',
  templateUrl: './treatment-history.component.html',
  styleUrl: './treatment-history.component.scss',
})
export class TreatmentHistoryComponent implements OnInit {
  visits$: Observable<Visit[]>;

  readonly SortOption = SortOption;

  readonly SortDirection = SortDirection;

  readonly searchControl = new FormControl<string>('');

  readonly sortOptionControl = new FormControl<SortOption>(SortOption.byDate);

  readonly sortDirectionControl = new FormControl<SortDirection>(SortDirection.desc);

  private doctorTypeTranslations: Record<string, string>;

  get currentLanguage(): string {
    return this.translate.defaultLang;
  }

  constructor(
    private readonly storageService: StorageService,
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly datePipe: DatePipe,
    private readonly destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.initializeValues();
    this.initializeListeners();
  }

  showDetails(visitId: string): void {
    this.router.navigate([visitId]);
  }

  changeSortOption(option: SortOption): void {
    if (option === this.sortOptionControl.value) {
      const direction = this.sortDirectionControl.value === SortDirection.asc ? SortDirection.desc : SortDirection.asc;
      this.sortDirectionControl.setValue(direction);
    } else {
      this.sortOptionControl.setValue(option);
      this.sortDirectionControl.setValue(SortDirection.asc);
    }
  }

  private initializeValues(): void {
    this.visits$ = combineLatest([
      this.searchControl.valueChanges.pipe(startWith(this.searchControl.value)),
      this.sortOptionControl.valueChanges.pipe(startWith(this.sortOptionControl.value)),
      this.sortDirectionControl.valueChanges.pipe(startWith(this.sortDirectionControl.value)),
      this.storageService.getVisits(),
    ]).pipe(
      map(([searchValue, sortOption, sortDirection, visits]) => {
        return visits
          .filter((visit: Visit) => {
            const date = this.datePipe.transform(visit.date, 'longDate', '', this.currentLanguage);
            const doctorType = this.doctorTypeTranslations[`doctorTypes.${ visit.doctorType }`];
            const { doctorName, address } = visit;

            return `${ date } ${ doctorType } - ${ doctorName } ${ address }`.toLowerCase().includes(searchValue.toLowerCase());
          })
          .sort((visit1, visit2) => {
            switch (sortOption) {
              case SortOption.byDate:
                return sortDirection === 'asc'
                  ? (new Date(visit1.date) as any) - (new Date(visit2.date) as any)
                  : (new Date(visit2.date) as any) - (new Date(visit1.date) as any)

              case SortOption.byDoctor:
                const doctorType1 = this.doctorTypeTranslations[`doctorTypes.${ visit1.doctorType }`];
                const doctorType2 = this.doctorTypeTranslations[`doctorTypes.${ visit2.doctorType }`];

                const doctor1 = `${ doctorType1 } ${ visit1.doctorName }`;
                const doctor2 = `${ doctorType2 } ${ visit2.doctorName }`;

                return sortDirection === 'asc'
                  ? sortAlphabetically(doctor1, doctor2)
                  : sortAlphabetically(doctor2, doctor1);

              case SortOption.byAddress:
                return sortDirection === 'asc'
                  ? sortAlphabetically(visit1.address, visit2.address)
                  : sortAlphabetically(visit2.address, visit1.address);
            }
          });
      }),
    );
  }

  private initializeListeners(): void {
    this.translate.onLangChange
      .pipe(
        startWith(this.translate.currentLang),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        const translationKeys = Object.values(DoctorType).map((type) => `doctorTypes.${ type }`);

        this.doctorTypeTranslations = this.translate.instant(translationKeys);
      });
  }
}

