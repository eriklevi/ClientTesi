import { Injectable } from '@angular/core';
import {User} from '../_models/user';
import {HttpClient} from '@angular/common/http';
import {Observable, pipe} from 'rxjs';
import {map, timeout} from 'rxjs/operators';
import {environment} from '../../environments/environment';

const host = environment.host;
const port = environment.port;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  register(user: User) {
    return this.http
      .post('http://' + host + ':' + port + '/usersapi/restricted/users', user)
      .pipe(
        timeout(7500)
      );
  }

  getUsers(): Observable<any> {
    return this.http
      .get('http://' + host + ':' + port + '/usersapi/restricted/users')
      .pipe(
        timeout(7500)
      );
  }

  getUser(id: string): Observable<any> {
    return this.http
      .get('http://' + host + ':' + port + '/usersapi/users/' + id)
      .pipe(
        timeout(7500)
      );
  }

  restrictedGetUser(id: string): Observable<any> {
    return this.http
      .get('http://' + host + ':' + port + '/usersapi/restricted/users/' + id)
      .pipe(
        timeout(7500)
      );
  }

  updateUser(user: User): Observable<any> {
    return this.http
      .put('http://' + host + ':' + port + '/usersapi/users/' + user.id, user)
      .pipe(
        timeout(7500)
      );
  }

  deleteUser(id: string): Observable<any> {
    return this.http
      .delete('http://' + host + ':' + port + '/usersapi/users/' + id)
      .pipe(
        timeout(7500)
      );
  }

  createUser(user: User): Observable<any> {
    return this.http
      .post('http://' + host + ':' + port + '/usersapi/users', user)
      .pipe(
        timeout(7500)
      );
  }
}
