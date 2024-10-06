import { createAction, props } from '@ngrx/store';
import { Visit } from '../models';

export const loadFilesStoragePath = createAction('[Treatments] Load files storage path');
export const filesStoragePathLoaded = createAction('[Treatments] Files storage path loaded', props<{ filesStoragePath: string }>());

export const loadVisits = createAction('[Treatments] Load visits');
export const visitsLoaded = createAction('[Treatments] Visits loaded', props<{ visits: Visit[] }>());

export const loadVisit = createAction('[Treatments] Load visit', props<{ visitId: string }>());
export const visitLoaded = createAction('[Treatments] Visit loaded', props<{ visit: Visit }>());

export const addVisit = createAction('[Treatments] Add visit', props<{ visit: Omit<Visit, 'id' | 'reports'> & { reports: File[] } }>());
export const visitAdded = createAction('[Treatments] Visit added', props<{ visit: Visit }>());

export const updateVisit = createAction('[Treatments] Update visit', props<{ visitId: string, changes: Omit<Visit, 'id' | 'reports'> & { reports: File[] } }>());
export const visitUpdated = createAction('[Treatments] Visit updated', props<{ visit: Visit }>());

export const deleteVisit = createAction('[Treatments] Delete visit', props<{ visitId: string }>());
export const visitDeleted = createAction('[Treatments] Visit deleted', props<{ visitId: string }>());
