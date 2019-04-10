import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {timeout} from 'rxjs/operators';
import {Room} from '../_models/room';
import {Building} from '../_models/building';

const host = environment.host;
const port = environment.port;

@Injectable({
  providedIn: 'root'
})
export class BuildingService {

  constructor(
    private http: HttpClient
  ) { }

  getBuildings(): Observable<any> {
    return this.http
      .get('http://' + host + ':' + port + '/sniffersapi/buildings')
      .pipe(
        timeout(7500)
      );
  }

  getRoomsByBuildingId(id: string): Observable<any> {
    return this.http
      .get('http://' + host + ':' + port + '/sniffersapi/buildings/' + id + '/rooms')
      .pipe(
        timeout(7500)
      );
  }

  addRoomToBuildingById(id: string, room: Room): Observable<any> {
    return this.http
      .post('http://' + host + ':' + port + '/sniffersapi/buildings/' + id + '/rooms', room)
      .pipe(
        timeout(7500)
      );
  }

  addBuilding(building: Building): Observable<any> {
    return this.http
      .post('http://' + host + ':' + port + '/sniffersapi/buildings', building)
      .pipe(
        timeout(7500)
      );
  }
}
