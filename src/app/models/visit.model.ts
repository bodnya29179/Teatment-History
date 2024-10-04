import { DoctorType } from './doctor-type.model';

export interface Visit {
  id: string;
  description: string;
  conclusion: string;
  doctorName: string;
  doctorType: DoctorType;
  reports: string[];
  address: string;
  date: string;
}
