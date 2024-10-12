import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, firstValueFrom, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { FileService, TreatmentFacadeService, VisitService } from '../services';
import {
  addVisit,
  deleteVisit,
  exportData,
  filesStoragePathLoaded,
  loadFilesStoragePath,
  loadVisit,
  loadVisits,
  updateVisit,
  visitAdded,
  visitDeleted,
  visitLoaded,
  visitsLoaded,
  visitUpdated,
} from './treatment.actions';
import { Visit } from '../models';
import { ActionType } from '@ngrx/store';

@Injectable()
export class TreatmentEffects {
  private readonly loadFilesStoragePath$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(loadFilesStoragePath),
        switchMap(() => {
          return this.visitService.getFilesPath()
            .pipe(
              map((filesStoragePath: string) => filesStoragePathLoaded({ filesStoragePath })),
              catchError(() => EMPTY),
            );
        }),
      );
  });

  private readonly loadVisits$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(loadVisits),
        switchMap(() => {
          return this.visitService.getVisits()
            .pipe(
              map((visits: Visit[]) => visitsLoaded({ visits })),
              catchError(() => EMPTY),
            );
        }),
      );
  });

  private readonly loadVisit$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(loadVisit),
        mergeMap(({ visitId }: ActionType<typeof loadVisit>) => {
          return this.visitService.getVisitById(visitId)
            .pipe(
              map((visit: Visit) => visitLoaded({ visit })),
              catchError((error: HttpErrorResponse) => {
                if (error.status === HttpStatusCode.NotFound) {
                  this.router.navigate(['/']);
                }

                return EMPTY;
              }),
            );
        }),
      );
  });

  private readonly addVisit$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(addVisit),
        mergeMap(({ visit }: ActionType<typeof addVisit>) => {
          const filePaths$ = visit.reports.length
            ? this.visitService.uploadFiles(visit.reports)
            : of([]);

          return filePaths$.pipe(
            map((reports: string[]) => {
              return { ...visit, reports } as Omit<Visit, 'id'>;
            }),
          );
        }),
        switchMap((visit: Omit<Visit, 'id'>) => {
          return this.visitService.addVisit(visit)
            .pipe(
              map((visit: Visit) => visitAdded({ visit })),
              catchError(() => EMPTY),
            );
        }),
      );
  });

  private readonly updateVisit$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(updateVisit),
        mergeMap(({ visitId, changes }: ActionType<typeof updateVisit>) => {
          return this.getVisitPayload(visitId, changes);
        }),
        switchMap((visit: Visit) => {
          return this.visitService.updateVisit(visit)
            .pipe(
              map((visit: Visit) => visitUpdated({ visit })),
              catchError(() => EMPTY),
            );
        }),
      );
  });

  private readonly deleteVisit$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(deleteVisit),
        mergeMap(({ visitId }: ActionType<typeof deleteVisit>) => {
          return this.visitService.deleteVisit(visitId)
            .pipe(
              map(() => visitDeleted({ visitId })),
              catchError(() => EMPTY),
            );
        }),
      );
  });

  private readonly exportData$ = createEffect(() => {
    return this.actions$
      .pipe(
        ofType(exportData),
        mergeMap(() => {
          return this.visitService.exportData()
            .pipe(
              tap((blob: Blob) => this.fileService.downloadFile(blob, 'database.zip')),
              catchError(() => EMPTY),
            );
        }),
      );
  }, { dispatch: false });

  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly visitService: VisitService,
    private readonly fileService: FileService,
    private readonly treatmentFacadeService: TreatmentFacadeService,
  ) {}

  private async getVisitPayload(visitId: string, changes: Omit<Visit, 'id' | 'reports'> & { reports: File[] }): Promise<Visit> {
    const visit = await firstValueFrom(this.treatmentFacadeService.getVisitById(visitId));
    const previousReports = visit.reports;

    const reportsToDelete = previousReports.filter((fileName: string) => {
      return !changes.reports.find((file: File) => file.name === fileName);
    });

    const reportsToAdd = changes.reports.filter((file: File) => {
      return !previousReports.find((fileName: string) => file.name === fileName);
    });

    const reportsToLeave = changes.reports
      .filter((file: File) => !!previousReports.find((fileName: string) => file.name === fileName))
      .map((file: File) => file.name);

    const visitReports = [...reportsToLeave];

    if (reportsToAdd.length) {
      const addedReports = await firstValueFrom(this.visitService.uploadFiles(reportsToAdd));
      visitReports.push(...addedReports);
    }

    if (reportsToDelete.length) {
      await firstValueFrom(this.visitService.deleteFiles(reportsToDelete));
    }

    return {
      id: visitId,
      ...changes,
      reports: visitReports,
    } as Visit;
  }
}
