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

  getTotalParsedPacketsBySnifferName(snifferName: string): Observable<any> {
    const params = new HttpParams()
      .set('name', snifferName);
    return this.http
      .get('http://' + host + ':' + port + '/packetsapi/parsed', {params})
      .pipe(
        timeout(7500)
      );
  }

  getGlobalParsedPacketsBySnifferName(snifferName: string): Observable<any> {
    const params = new HttpParams()
      .set('name', snifferName);
    return this.http
      .get('http://' + host + ':' + port + '/packetsapi/parsed/global', {params})
      .pipe(
        timeout(7500)
      );
  }

  getLocalParsedPacketsBySnifferName(snifferName: string): Observable<any> {
    const params = new HttpParams()
      .set('name', snifferName);
    return this.http
      .get('http://' + host + ':' + port + '/packetsapi/parsed/local', {params})
      .pipe(
        timeout(7500)
      );
  }

  getCountedPacketsByBuilding(buildingId: string, from: number, to: number, resolution: string): Observable<any> {
    const params = new HttpParams()
      .set('from', from.toString())
      .set('to', to.toString())
      .set('resolution', resolution);
    return this.http
      .get('http://' + host + ':' + port + '/packetsapi/counted/' + buildingId, {params})
      .pipe(
        timeout(7500)
      );
  }

  getCountedPacketsByRoom(buildingId: string, roomId: string, from: number, to: number, resolution: string): Observable<any> {
    const params = new HttpParams()
      .set('from', from.toString())
      .set('to', to.toString())
      .set('resolution', resolution);
    return this.http
      .get('http://' + host + ':' + port + '/packetsapi/counted/' + buildingId + '/' + roomId, {params})
      .pipe(
        timeout(7500)
      );
  }

  getCountedPacketsBySniffer(buildingId: string, roomId: string, snifferId: string, from: number, to: number, resolution: string): Observable<any> {
    const params = new HttpParams()
      .set('from', from.toString())
      .set('to', to.toString())
      .set('resolution', resolution)
      .set('type', 'hola')
      .set('sniffer', snifferId );
    return this.http
      .get('http://' + host + ':' + port + '/packetsapi/counted/' + buildingId + '/' + roomId, {params})
      .pipe(
        timeout(7500)
      );
  }
}
