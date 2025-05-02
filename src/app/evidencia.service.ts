import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EvidenciaService {
  private apiUrl = 'http://127.0.0.1:8000/validate'; //TODO: Endpoint de DEV

  constructor(private http: HttpClient) {}

  enviarEvidencia(datos:any): Observable<any> {
    return this.http.post<any>(this.apiUrl, datos);
  }
}
