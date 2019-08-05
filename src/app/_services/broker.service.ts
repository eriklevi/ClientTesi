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
export class BrokerService {

  constructor(private http: HttpClient) {

  }

  stopBroker(): Observable<any> {
    return this.http
      .get('http://' + host + ':' + port + '/moquetteapi/stop')
      .pipe(
        timeout(15000)
      );
  }
  startBroker(): Observable<any> {
    return this.http
      .get('http://' + host + ':' + port + '/moquetteapi/start')
      .pipe(
        timeout(15000)
      );
  }
}
