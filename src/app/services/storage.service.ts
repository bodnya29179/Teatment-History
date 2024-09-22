import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { Visit } from '../models';
import { VisitService } from './visit.service';

@Injectable()
export class StorageService {
  private readonly visits$ = new BehaviorSubject<Visit[]>(undefined);

  private readonly filesStoragePath$ = new BehaviorSubject<string>(undefined);

  constructor(private readonly visitService: VisitService) {}

  getFilesStoragePath(): Observable<string> {
    if (this.filesStoragePath$.value) {
      return this.filesStoragePath$;
    }

    return this.visitService.getFilesPath();
  }

  getVisits(): Observable<Visit[]> {
    return this.visitService.getVisits()
      .pipe(
        tap((visits: Visit[]) => this.visits$.next(visits)),
        switchMap(() => this.visits$),
      );
  }

  getVisitById(visitId: string): Observable<Visit> {
    return this.visitService.getVisitById(visitId);
  }

  addVisit({ reports, ...visit }: Omit<Visit, 'id' | 'reports'> & { reports: File[] }): Observable<Visit> {
    const reports$ = reports.length ? this.visitService.uploadFiles(reports) : of([]);

    return reports$
      .pipe(
        switchMap((filePaths: string[]) => {
          return this.visitService.addVisit({ ...visit, reports: filePaths });
        }),
        tap((visit: Visit) => {
          this.visits$.next([visit, ...this.visits$.value]);
        })
      );
  }

  updateVisit(visit: Visit): Observable<Visit> {
    return this.visitService.updateVisit(visit)
      .pipe(
        tap((updatedVisit: Visit) => {
          const visits = this.visits$.value.map((visit) => {
            return visit.id === updatedVisit.id ? updatedVisit : visit;
          });

          this.visits$.next(visits);
        })
      );
  }

  deleteVisit(visitId: string): Observable<void> {
    return this.visitService.deleteVisit(visitId)
      .pipe(
        tap(() => {
          this.visits$.next(this.visits$.value.filter(({ id }) => id !== visitId));
        }),
      );
  }
}
