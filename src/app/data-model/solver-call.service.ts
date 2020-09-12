import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    Authorization: 'my-auth-token'
  })
};


export interface SolverResult {
  resultJson: string;
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
  sendModelToSolver(solverInput: SolverInput): Observable<SolverResult> {
    return this.http.post<SolverResult>(this.solverURL, solverInput, httpOptions)
      .pipe(
        //catchError(this.handleError('sendModel', hero))
      );
  }




}


