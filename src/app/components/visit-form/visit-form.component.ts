import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TreatmentFacadeService } from '../../services';
import { DoctorType, Visit } from '../../models';

@Component({
  selector: 'app-visit-form',
  templateUrl: './visit-form.component.html',
  styleUrl: './visit-form.component.scss',
})
export class VisitFormComponent implements OnInit {
  @Input()
  visit: Visit;

  @Output()
  closeForm = new EventEmitter<void>();

  form: FormGroup;

  readonly doctorTypes = Object.values(DoctorType).map((doctorType) => {
    return {
      value: doctorType,
      label: `doctorTypes.${doctorType}`,
    };
  });

  readonly maxDate = new Date().toISOString().split('T')[0];

  get isEditing(): boolean {
    return !!this.visit;
  }

  constructor(private readonly treatmentFacadeService: TreatmentFacadeService) {}

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

    if (this.isEditing) {
      this.form.setValue({
        doctorName: this.visit.doctorName,
        doctorType: this.visit.doctorType,
        date: this.visit.date,
        description: this.visit.description,
        conclusion: this.visit.conclusion,
        address: this.visit.address,
        reports: this.visit.reports.map((fileName) => new File([], fileName)),
      });
    }
  }

  save(): void {
    if (this.isEditing) {
      this.treatmentFacadeService.updateVisit(this.visit.id, this.form.value);
    } else {
      this.treatmentFacadeService.addVisit(this.form.value);
      this.form.reset();
    }

    this.closeForm.emit();
  }

  cancel(): void {
    this.closeForm.emit();
  }

  handleFiles(event: Event): void {
    const reports = [
      ...Array.from((event.target as HTMLInputElement).files),
      ...this.form.controls['reports'].value,
    ];

    this.form.patchValue({ reports });
  }

  deleteReport(index: number): void {
    const reports = this.form.controls['reports'].value;

    this.form.patchValue({
      reports: [...reports.slice(0, index), ...reports.slice(index + 1)],
    });
  }
}
