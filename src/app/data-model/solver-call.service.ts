import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

const headers = new HttpHeaders({
    'Content-Type':  'application/json'
    // Authorization: 'my-auth-token'
  });

export interface SolverResult {
  resultText: string;
}

export interface SolverInput {
  inputJson: string;
}


@Injectable({
  providedIn: 'root'
})
export class SolverCallService {

  constructor(private http: HttpClient) { }

  solverURL = 'https://shrouded-escarpment-67155.herokuapp.com/api/solve';



  /** POST: send model to solver */
  sendModelToSolver(solverInput: SolverInput): Observable<string> {

    const httpOptions:Object = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      }),
      responseType: 'text'
    }

    return this.http.post<string>(
      this.solverURL, 
      solverInput.inputJson, 
      httpOptions)
      .pipe(
        //catchError(this.handleError('sendModel', hero))
      );
  }




}


