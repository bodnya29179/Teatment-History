import { DoctorTypes } from '../constants';

export type DoctorType = typeof DoctorTypes[keyof typeof DoctorTypes];
