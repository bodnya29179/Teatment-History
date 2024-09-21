import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Visit } from '../models';

@Injectable()
export class VisitService {
  private apiUrl = 'http://localhost:3000';

  constructor(private readonly http: HttpClient) {}

  getVisits(): Observable<Visit[]> {
    return this.http.get<Visit[]>(`${ this.apiUrl }/visits`);
  }

  addVisit(visit: Omit<Visit, 'id'>): Observable<Visit> {
    return this.http.post<Visit>(`${ this.apiUrl }/add-visit`, visit);
  }

  updateVisit(visit: Visit): Observable<Visit> {
    return this.http.put<Visit>(`${ this.apiUrl }/update-visit/${ visit.id }`, visit);
  }

  deleteVisit(visitId: string): Observable<void> {
    return this.http.delete<void>(`${ this.apiUrl }/delete-visit/${ visitId }`);
  }

  uploadFiles(files: File[]): Observable<string[]> {
    const formData = new FormData();

    files.forEach((file) => formData.append('reports', file));

    return this.http.post<{ fileNames: string[] }>(`${ this.apiUrl }/upload-files`, formData)
      .pipe(map(({ fileNames }) => fileNames));
  }

  getFilesPath(): Observable<string> {
    return this.http.get<{ filesStoragePath: string }>(`${ this.apiUrl }/files-storage-path`)
      .pipe(map(({ filesStoragePath }) => filesStoragePath));
  }
  //
  // deleteFile(fileName: string): Observable<void> {
  //   return this.http.delete<void>(`${ this.apiUrl }/delete-file`, { body: { fileName } });
  // };
}
