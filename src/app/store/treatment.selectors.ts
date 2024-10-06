import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TreatmentState, Visit } from '../models';

const selectFeature = createFeatureSelector<TreatmentState>('treatments');

export const selectAreLoaded = createSelector(
  selectFeature,
  (state: TreatmentState) => state.areLoaded,
);

export const selectVisits = createSelector(
  selectFeature,
  (state: TreatmentState) => state.visits,
);

export const selectVisitById = (visitId: string) => createSelector(
  selectVisits,
  (visits: Visit[]) => visits?.find((visit: Visit) => visit.id === visitId),
);

export const selectFilesStoragePath = createSelector(
  selectFeature,
  (state: TreatmentState) => state.filesStoragePath,
);
