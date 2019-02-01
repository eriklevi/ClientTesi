import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as jwt from 'jwt-decode';

import { LoginUser } from '../_models/loginUser';
import {environment} from '../../environments/environment';

const host = environment.host;
const port = environment.port;

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<LoginUser>;
  public currentUser: Observable<LoginUser>;
  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<LoginUser>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get currentUserValue(): LoginUser {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    const body = 'username=' + username + '&password=' + password + '&grant_type=password';
    return this.http.post<any>('http://' + host + ':' + port + '/oauth/token', body, {
      headers : new HttpHeaders({
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Accept' :  'application/json',
        'Authorization' : 'Basic Y2xpZW50OnNlY3JldA=='
      })
    })
      .pipe(map(response => {
        // login successful if there's a jwt token in the response
        if (response && response.access_token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          const decodedToken = jwt(response.access_token);
          const user: LoginUser = new LoginUser();
          user.username = decodedToken['user_name'];
          user.authorities = decodedToken['authorities'];
          user.token = response.access_token;
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }

        return response;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
