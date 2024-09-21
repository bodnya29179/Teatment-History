import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DoctorTypes } from '../../constants';
import { StorageService } from '../../services';
import { DoctorType } from '../../models';
import { firstValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-visit',
  templateUrl: './add-visit.component.html',
  styleUrl: './add-visit.component.scss',
})
export class AddVisitComponent implements OnInit {
  form: FormGroup;

  readonly doctorTypes = Object.values(DoctorTypes).map((doctorType) => {
    return {
      value: doctorType,
      label: `doctorTypes.${doctorType}`,
    };
  });

  readonly maxDate = new Date().toISOString().split('T')[0];

  constructor(
    private readonly storageService: StorageService,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      doctorName: new FormControl<string>(''),
      doctorType: new FormControl<DoctorType>(undefined, [Validators.required]),
      date: new FormControl<string>(undefined, [Validators.required]),
      description: new FormControl<string>('', [Validators.required]),
      conclusion: new FormControl<string>('', [Validators.required]),
      address: new FormControl<string>(''),
      reports: new FormControl<File[]>([]),
    });
  }

  addVisit(): void {
    firstValueFrom(this.storageService.addVisit(this.form.value));
    this.form.reset();
  }

  handleFiles(event: Event): void {
    const reports = Array.from((event.target as HTMLInputElement).files);

    this.form.patchValue({ reports });
  }

  deleteReport(index: number): void {
    const reports = this.form.controls['reports'].value;

    this.form.patchValue({
      reports: [...reports.slice(0, index), ...reports.slice(index + 1)],
    });
  }
}
