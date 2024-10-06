import { Visit } from './visit.model';

export interface TreatmentState {
  areLoaded: boolean;
  visits: Visit[];
  filesStoragePath: string;
}
