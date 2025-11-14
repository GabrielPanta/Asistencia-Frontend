import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Asistencia } from '../models/asistencia';

@Injectable({ providedIn: 'root' })
export class AsistenciaService {
  base = `${environment.apiUrl}/asistencia`;

  constructor(private http: HttpClient) {}

  listar(fecha: string): Observable<Asistencia[]> {
  return this.http.get<Asistencia[]>(`${this.base}/empresa/${fecha}`);
}


  update(id: number, body: Partial<Asistencia>) {
    return this.http.put<Asistencia>(`${this.base}/${id}`, body);
  }

  updateRespuestaObservacion(id: number, respuestaObservacion: string) {
    return this.http.put<Asistencia>(
      `${this.base}/${id}/respuestaObservacion`,
      { respuestaObservacion }
    );
  }

  importar(file: File, fecha: string) {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('fecha', fecha);
    return this.http.post(`${this.base}/importar/empresa`, fd, {
      observe: 'events',
      reportProgress: true,
    });
  }

  exportar(fecha: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.base}/exportar/${fecha}`, { observe: 'response', responseType: 'blob' });
  }
}
