import { Injectable } from '@angular/core';
import { filter, firstValueFrom, Observable, switchMap } from 'rxjs';
import { Visit } from '../models';
import { Store } from '@ngrx/store';
import {
  addVisit,
  deleteVisit,
  exportData,
  loadFilesStoragePath,
  loadVisit,
  loadVisits,
  selectAreLoaded,
  selectFilesStoragePath,
  selectVisitById,
  selectVisits,
  updateVisit,
} from '../store';

@Injectable()
export class TreatmentFacadeService {
  constructor(private readonly store: Store) {}

  areVisitsLoaded(): Observable<boolean> {
    return this.store.select(selectAreLoaded);
  }

  async loadVisits(): Promise<void> {
    const areVisitsLoaded = await firstValueFrom(this.areVisitsLoaded());

    if (!areVisitsLoaded) {
      this.store.dispatch(loadVisits());
    }
  }

  async loadVisit(visitId: string): Promise<void> {
    const areVisitsLoaded = await firstValueFrom(this.areVisitsLoaded());

    if (!areVisitsLoaded) {
      this.store.dispatch(loadVisit({ visitId }));
    }
  }

  getVisits(): Observable<Visit[]> {
    return this.areVisitsLoaded()
      .pipe(
        filter(Boolean),
        switchMap(() => this.store.select(selectVisits)),
      );
  }

  getVisitById(visitId: string): Observable<Visit | undefined> {
    return this.store.select(selectVisitById(visitId)).pipe(filter(Boolean));
  }

  addVisit(visit: Omit<Visit, 'id' | 'reports'> & { reports: File[] }): void {
    this.store.dispatch(addVisit({ visit }));
  }

  updateVisit(visitId: string, changes: Omit<Visit, 'id' | 'reports'> & { reports: File[] }): void {
    this.store.dispatch(updateVisit({ visitId, changes }));
  }

  deleteVisit(visitId: string): void {
    this.store.dispatch(deleteVisit({ visitId }));
  }

  loadFilesStoragePath(): void {
    this.store.dispatch(loadFilesStoragePath());
  }

  getFilesStoragePath(): Observable<string> {
    return this.store.select(selectFilesStoragePath).pipe(filter(Boolean));
  }

  exportData(): void {
    this.store.dispatch(exportData());
  }
}
