import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, map, Observable, switchMap, tap } from 'rxjs';
import { Visit } from '../models';
import { VisitService } from './visit.service';

@Injectable()
export class StorageService {
  private readonly visits$ = new BehaviorSubject<Visit[]>([]);

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
    const visit = this.visits$.value.find((visit: Visit) => visit.id === visitId);
    const visit$ = this.visits$.pipe(map(visits => visits.find((visit: Visit) => visit.id === visitId)));

    if (visit) {
      return visit$;
    }

    return this.visitService.getVisitById(visitId)
      .pipe(
        tap((visit: Visit) => {
          this.visits$.next([...this.visits$.value, visit]);
        }),
        switchMap(() => visit$),
      );
  }

  async addVisit({ reports, ...visit }: Omit<Visit, 'id' | 'reports'> & { reports: File[] }): Promise<void> {
    const filePaths = reports.length
      ? await firstValueFrom(this.visitService.uploadFiles(reports))
      : [];

    const addedVisit = await firstValueFrom(this.visitService.addVisit({ ...visit, reports: filePaths }));

    this.visits$.next([addedVisit, ...this.visits$.value]);
  }

  async updateVisit(visitId: string, changes: Omit<Visit, 'id' | 'reports'> & { reports: File[] }): Promise<void> {
    const newValue = { ...changes };
    const previousValue = this.visits$.value.find((visit: Visit) => visit.id === visitId);

    const reportsToDelete = previousValue.reports.filter((fileName: string) => {
      return !newValue.reports.find((file: File) => file.name === fileName);
    });

    const reportsToAdd = newValue.reports.filter((file: File) => {
      return !previousValue.reports.find((fileName: string) => file.name === fileName);
    });

    const reportsToLeave = newValue.reports
      .filter((file: File) => !!previousValue.reports.find((fileName) => file.name === fileName))
      .map((file: File) => file.name);

    const visitReports = [...reportsToLeave];

    if (reportsToAdd.length) {
      const addedReports = await firstValueFrom(this.visitService.uploadFiles(reportsToAdd));
      visitReports.push(...addedReports);
    }

    if (reportsToDelete.length) {
      await firstValueFrom(this.visitService.deleteFiles(reportsToDelete));
    }

    const updatedVisit = await firstValueFrom(this.visitService.updateVisit({
      id: visitId,
      ...changes,
      reports: visitReports,
    }));

    const visits = this.visits$.value.map((visit) => {
      return visit.id === updatedVisit.id ? updatedVisit : visit;
    });

    this.visits$.next(visits);
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
