import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Visit } from '../models';

@Injectable()
export class VisitService {
  private apiUrl = 'http://localhost:3000';

  constructor(private readonly http: HttpClient) {}

  getVisits(): Observable<Visit[]> {
    return this.http.get<Visit[]>(`${ this.apiUrl }/visits`);
  }

  getVisitById(visitId: string): Observable<Visit> {
    return this.http.get<Visit>(`${ this.apiUrl }/visits/${ visitId }`);
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

    return this.http.post<string[]>(`${ this.apiUrl }/upload-files`, formData);
  }

  deleteFiles(fileNames: string[]): Observable<void> {
    return this.http.delete<void>(`${ this.apiUrl }/delete-files`, { body: fileNames });
  }

  getFilesPath(): Observable<string> {
    return this.http.get<string>(`${ this.apiUrl }/files-storage-path`);
  }

  exportData(): Observable<Blob> {
    return this.http.get(`${ this.apiUrl }/export`, { responseType: 'blob' });
  }

  importData(file: File): Observable<Visit[]> {
    const formData = new FormData();

    formData.append('archive', file);

    return this.http.post<Visit[]>(`${ this.apiUrl }/import`, formData);
  }
}
