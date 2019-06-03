import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {timeout} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {DeviceData} from '../_models/device-data';


const host = environment.host;
const port = environment.port;

@Injectable({
  providedIn: 'root'
})
export class TrackingServiceService {

  constructor(
    private http: HttpClient
  ) { }

  trackDeviceByDayAndMac(mac: string, from: number, to: number): Observable<any> {
    const params = new HttpParams()
      .set('mac', mac)
      .set('from', String(from))
      .set('to', String(to));
    return this.http
      .get('http://' + host + ':' + port + '/packetsapi/track', {params})
      .pipe(
        timeout(10000)
      );
  }

  getDistinctMacAsDeviceInfoByHour(from: number, to: number): Observable<any> {
    const params = new HttpParams()
      .set('from', String(from))
      .set('to', String(to));
    return this.http
      .get('http://' + host + ':' + port + '/packetsapi/track/deviceinfo', {params})
      .pipe(
        timeout(10000)
      );
  }
}
