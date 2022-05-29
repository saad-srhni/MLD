import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Collaborateur } from '../dto/collaborateur';

@Injectable({
  providedIn: 'root'
})
export class ApiCollaborateurService {

  constructor(private http: HttpClient) { }


  getAllCollaborateurs(): Observable<{ responseCode: number, responseMessage: string, results: Collaborateur[] }> {
    return this.http.get<{ responseCode: number, responseMessage: string, results: Collaborateur[] }>(
      environment.baseUrl + "collaborateur"
    );
  }


  createCollaborateur(collaborateur: Collaborateur): Observable<any> {
    console.log(collaborateur)
    return this.http.post(
      environment.baseUrl + "collaborateur",
      {
        ...collaborateur
      }
    );
  }

  updateCollaborateur(collaborateur: Collaborateur, matricule: number): Observable<any> {
    return this.http.put(
      environment.baseUrl + "collaborateur/" + matricule, {
      ...collaborateur
    }
    );
  }

  deleteCollaborateur(matricule: number): Observable<any> {
    return this.http.delete(
      environment.baseUrl + "collaborateur/" + matricule
    );
  }

}
