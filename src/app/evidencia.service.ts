import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', 
})
export class EvidenciaService {
  private apiUrl = '/api/trainer/predict';

  constructor(private http: HttpClient) {}

  enviarEvidencia(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
}
