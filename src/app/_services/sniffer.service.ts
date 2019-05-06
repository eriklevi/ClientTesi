import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {timeout} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Sniffer} from '../_models/sniffer';
import {environment} from '../../environments/environment';

const host = environment.host;
const port = environment.port;

@Injectable({
  providedIn: 'root'
})
export class SnifferService {

  constructor(private http: HttpClient) { }

  getSniffers(): Observable<any> {
    return this.http
      .get('http://' + host + ':' + port + '/sniffersapi/sniffers')
      .pipe(
        timeout(7500)
      );
  }
  getSifferByName(name: string): Observable<any> {
    return this.http
      .get('http://' + host + ':' + port + '/sniffersapi/sniffers/' + name)
      .pipe(
        timeout(7500)
      );
  }
  deleteSnifferById(id: string): Observable<any> {
    return this.http
      .delete('http://' + host + ':' + port + '/sniffersapi/sniffers/' + id)
      .pipe(
        timeout(7500)
      );
  }
  updateSnifferByName(sniffer: Sniffer): Observable<any> {
    return this.http
      .put('http://' + host + ':' + port + '/sniffersapi/sniffers/' + sniffer.name, sniffer)
      .pipe(
        timeout(7500)
      );
  }
  createSniffer(sniffer: Sniffer): Observable<any> {
    return this.http
      .post('http://' + host + ':' + port + '/sniffersapi/sniffers', sniffer)
      .pipe(
        timeout(7500)
      );
  }
  getConnectedSniffers(): Observable<any> {
    return this.http
      .get('http://' + host + ':' + port + '/moquetteapi/clients')
      .pipe(
        timeout(7500)
      );
  }
}
