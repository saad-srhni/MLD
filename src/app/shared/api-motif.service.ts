import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MotifAbsence } from '../dto/motif-absence';

@Injectable({
  providedIn: 'root'
})
export class ApiMotifService {

  constructor(private http: HttpClient) { }

  getAllmotif(): Observable<{ responseCode: number, responseMessage: string, results: MotifAbsence[] }> {
    return this.http.get<{ responseCode: number, responseMessage: string, results: MotifAbsence[] }>(
      environment.baseUrl + "motifAbsence"
    );
  }
}
