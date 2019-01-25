import { Injectable } from '@angular/core';
import {User} from '../_models/user';
import {HttpClient} from '@angular/common/http';

const host = '192.168.1.44';
const port = 8762;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  register(user: User) {
    return this.http.post('http://' + host + ':' + port + '/users', user);
  }

  getUsers() {
    return this.http.get('http://' + host + ':' + port + '/users');
  }

}
