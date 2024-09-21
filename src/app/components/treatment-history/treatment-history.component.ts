import { Component, OnInit } from '@angular/core';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { Visit } from '../../models';
import { StorageService } from '../../services';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';
import { DoctorTypes, SortDirections, SortOptions } from '../../constants';
import { DatePipe } from '@angular/common';
import { sortAlphabetically } from '../../utils';

@Component({
  selector: 'app-treatment-history',
  templateUrl: './treatment-history.component.html',
  styleUrl: './treatment-history.component.scss',
})
export class TreatmentHistoryComponent implements OnInit {
  visits$: Observable<Visit[]>;

  doctorTypeTranslations: Record<string, string>;

  readonly searchControl = new FormControl<string>('');

  readonly sortOptionControl = new FormControl<typeof SortOptions[keyof typeof SortOptions]>(SortOptions.byDate);

  readonly sortDirectionControl = new FormControl<typeof SortDirections[keyof typeof SortDirections]>(SortDirections.desc);

  get currentLanguage(): string {
    return this.translate.defaultLang;
  }

  constructor(
    private readonly storageService: StorageService,
    private readonly router: Router,
    private readonly translate: TranslateService,
    private readonly datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.translate.onLangChange
      .pipe(startWith(this.translate.currentLang))
      .subscribe(() => {
        const translationKeys = Object.values(DoctorTypes).map((type) => `doctorTypes.${ type }`);

        this.doctorTypeTranslations = this.translate.instant(translationKeys);
      });

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
              case SortOptions.byDate:
                return sortDirection === 'asc'
                  ? (new Date(visit1.date) as any) - (new Date(visit2.date) as any)
                  : (new Date(visit2.date) as any) - (new Date(visit1.date) as any)

              case SortOptions.byDoctor:
                const doctorType1 = this.doctorTypeTranslations[`doctorTypes.${ visit1.doctorType }`];
                const doctorType2 = this.doctorTypeTranslations[`doctorTypes.${ visit2.doctorType }`];

                const doctor1 = `${ doctorType1 } ${ visit1.doctorName }`;
                const doctor2 = `${ doctorType2 } ${ visit2.doctorName }`;

                return sortDirection === 'asc'
                  ? sortAlphabetically(doctor1, doctor2)
                  : sortAlphabetically(doctor2, doctor1);

              case SortOptions.byAddress:
                return sortDirection === 'asc'
                  ? sortAlphabetically(visit1.address, visit2.address)
                  : sortAlphabetically(visit2.address, visit1.address);
            }
          });
      }),
    );
  }

  showDetails(visitId: string): void {
    this.router.navigate([]); // TODO
  }

  changeSortOption(option: typeof SortOptions[keyof typeof SortOptions]): void {
    if (option === this.sortOptionControl.value) {
      this.sortDirectionControl.setValue(this.sortDirectionControl.value === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortOptionControl.setValue(option);
      this.sortDirectionControl.setValue('asc');
    }
  }
}

