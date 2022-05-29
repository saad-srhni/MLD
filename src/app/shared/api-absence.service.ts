import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Absence } from '../dto/absence';

@Injectable({
  providedIn: 'root'
})
export class ApiAbsenceService {

  constructor(private http: HttpClient) { }

  getAllAbsences(): Observable<{ responseCode: number, responseMessage: string, results: Absence[] }> {
    return this.http.get<{ responseCode: number, responseMessage: string, results: Absence[] }>(
      environment.baseUrl + "absence"
    );
  }

  getAllAbsencesByid(collaborateur: number): Observable<{ responseCode: number, responseMessage: string, results: Absence[] }> {
    return this.http.get<{ responseCode: number, responseMessage: string, results: Absence[] }>(
      environment.baseUrl + "absence/" + collaborateur
    );
  }

  createAbsence(absence: Absence): Observable<any> {
    return this.http.post(
      environment.baseUrl + "absence",
      {
        ...absence
      }
    );
  }

  updateAbsence(absence: Absence, idAbsence: number): Observable<any> {
    return this.http.put(
      environment.baseUrl + "absence/" + idAbsence,
      {
        ...absence
      }
    );
  }

  deleteAbsence(idAbsence: number): Observable<any> {
    return this.http.delete(
      environment.baseUrl + "absence/" + idAbsence
    );
  }

}
