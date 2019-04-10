import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {timeout} from 'rxjs/operators';

const host = environment.host;
const port = environment.port;

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(
    private http: HttpClient
  ) { }

  getRoomById(id: string): Observable<any> {
    return this.http
      .get('http://' + host + ':' + port + '/sniffersapi/rooms/' + id)
      .pipe(
        timeout(7500)
      );
  }
}
