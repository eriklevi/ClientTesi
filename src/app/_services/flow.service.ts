import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {FlowData} from '../_models/flow-data';
import {Observable} from 'rxjs';
import {timeout} from 'rxjs/operators';

const host = environment.host;
const port = environment.port;

@Injectable({
  providedIn: 'root'
})
export class FlowService {

  constructor(private httpClient: HttpClient) { }

  getFlow(from: number, to: number): Observable<any> {
    const params = new HttpParams()
      .set('from', from.toString())
      .set('to', to.toString());
    return this.httpClient.get('http://' + host + ':' + port + '/packetsapi/flow/', {params})
      .pipe(
        timeout(15000)
      );
  }

  getPositionFlow(from: number, to: number): Observable<any> {
    const params = new HttpParams()
      .set('from', from.toString())
      .set('to', to.toString());
    return this.httpClient.get('http://' + host + ':' + port + '/packetsapi/flow2/', {params})
      .pipe(
        timeout(30000)
      );
  }
}
