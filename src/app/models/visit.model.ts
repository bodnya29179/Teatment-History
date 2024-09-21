import { DoctorType } from './doctor-type.model';

export interface Visit {
  id: string;
  title: string;
  description: string;
  doctorName: string;
  doctorType: DoctorType;
  reports: string[];
  address: string;
  date: string;
}
