import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {timeout} from 'rxjs/operators';

const host = environment.host;
const port = environment.port;

@Injectable({
  providedIn: 'root'
})
export class CountedPacketsService {

  constructor(
    private http: HttpClient
  ) { }

  getTotalParsedPackets(): Observable<any> {
    return this.http
      .get('http://' + host + ':' + port + '/packetsapi/general/parsed')
      .pipe(
        timeout(15000)
      );
  }

  getTotalParsedPacketsBySnifferName(snifferId: string): Observable<any> {
    return this.http
      .get('http://' + host + ':' + port + '/packetsapi/general/parsed/' + snifferId)
      .pipe(
        timeout(15000)
      );
  }

  getCountedPacketsByBuilding(buildingId: string, from: number, to: number, resolution: string, mode: string = 'mean'): Observable<any> {
    const params = new HttpParams()
      .set('from', from.toString())
      .set('to', to.toString())
      .set('resolution', resolution)
      .set('mode', mode);
    return this.http
      .get('http://' + host + ':' + port + '/packetsapi/counted/' + buildingId, {params})
      .pipe(
        timeout(7500)
      );
  }

  getCountedPacketsByRoom(buildingId: string, roomId: string, from: number, to: number, resolution: string, mode: string = 'mean'): Observable<any> {
    const params = new HttpParams()
      .set('from', from.toString())
      .set('to', to.toString())
      .set('resolution', resolution)
      .set('mode', mode);
    return this.http
      .get('http://' + host + ':' + port + '/packetsapi/counted/' + buildingId + '/' + roomId, {params})
      .pipe(
        timeout(7500)
      );
  }

  getCountedPacketsBySniffer(buildingId: string, roomId: string, snifferId: string, from: number, to: number, resolution: string, mode: string = 'mean'): Observable<any> {
    const params = new HttpParams()
      .set('from', from.toString())
      .set('to', to.toString())
      .set('resolution', resolution)
      .set('mode', mode);
    return this.http
      .get('http://' + host + ':' + port + '/packetsapi/counted/' + buildingId + '/' + roomId + '/' + snifferId, {params})
      .pipe(
        timeout(7500)
      );
  }

  getLastEstimationBySnifferId(id: string): Observable<any> {
    return this.http.get('http://' + host + ':' + port + '/packetsapi/general/counted/' + id + '/last')
      .pipe(
        timeout(7500)
      );
  }

  getMeanBySnifferId(id: string, timestamp: number): Observable<any> {
    const params = new HttpParams()
      .set('timestamp', timestamp.toString());
    return this.http.get('http://' + host + ':' + port + '/packetsapi/general/counted/' + id + '/mean', {params})
      .pipe(
        timeout(10000)
      );
  }
}
