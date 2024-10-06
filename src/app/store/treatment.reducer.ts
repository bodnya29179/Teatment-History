import { Action, ActionType, createReducer, on } from '@ngrx/store';
import { TreatmentState, Visit } from '../models';
import {
  filesStoragePathLoaded,
  visitAdded,
  visitDeleted,
  visitLoaded,
  visitsLoaded,
  visitUpdated,
} from './treatment.actions';

const initialState: TreatmentState = {
  areLoaded: false,
  visits: undefined,
  filesStoragePath: undefined,
};

const reducer = createReducer(
  initialState,
  on(visitsLoaded, (state: TreatmentState, action: ActionType<typeof visitsLoaded>) => {
    return {
      ...state,
      areLoaded: true,
      visits: action.visits,
    };
  }),
  on(visitLoaded, (state: TreatmentState, action: ActionType<typeof visitLoaded>) => {
    return {
      ...state,
      visits: [...(state.visits || []), action.visit],
    };
  }),
  on(visitAdded, (state: TreatmentState, action: ActionType<typeof visitAdded>) => {
    return {
      ...state,
      visits: [...(state.visits || []), action.visit],
    };
  }),
  on(visitUpdated, (state: TreatmentState, action: ActionType<typeof visitUpdated>) => {
    const visits = [...state.visits];
    const indexToModify = visits.findIndex((visit: Visit) => visit.id === action.visit.id);

    visits[indexToModify] = action.visit;

    return {
      ...state,
      visits,
    };
  }),
  on(visitDeleted, (state: TreatmentState, action: ActionType<typeof visitDeleted>) => {
    return {
      ...state,
      visits: state.visits.filter((visit: Visit) => visit.id !== action.visitId),
    };
  }),
  on(filesStoragePathLoaded, (state: TreatmentState, action: ActionType<typeof filesStoragePathLoaded>) => {
    return {
      ...state,
      filesStoragePath: action.filesStoragePath,
    };
  }),
);

export function treatmentReducer(state: TreatmentState, action: Action): TreatmentState {
  return reducer(state, action);
}
