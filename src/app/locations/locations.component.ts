import { Component, OnInit } from '@angular/core';
import {Building} from '../_models/building';
import {BuildingService} from '../_services/building.service';
import {AlertService} from '../_services/alert.service';
import {RoomService} from '../_services/room.service';
import {Room} from '../_models/room';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {

  buildingList: Building[];
  requestStart = false;
  name: string;
  currentBuilding: Building = null;
  roomName: any;
  roomList: Room[];

  constructor(
    private buildingService: BuildingService,
    private alertService: AlertService,
    private roomService: RoomService
  ) { }

  ngOnInit() {
    this.fetchBuildings();
  }

  fetchBuildings() {
    this.requestStart = true;
    this.buildingService
      .getBuildings()
      .subscribe(
        data => {
          this.buildingList = data;
          this.requestStart = false;
        }, error => {
          this.requestStart = false;
          this.alertService.error('Impossible to fetch building list!');
        }
      );
  }

  createBuilding() {
    this.requestStart = true;
    if (this.name) {
      const s = this.name.trim();
      if (s && s !== '') {
        const b: Building = new Building();
        b.name = this.name;
        this.buildingService.addBuilding(b)
          .subscribe(
            data => {
              this.requestStart = false;
              this.alertService.success('Building ' + b.name + ' successfully addedd!');
              this.fetchBuildings(); // to update visualized data
            }, error => {
              this.alertService.error('Imossible to create new building!');
            }
          );
      } else {
        this.requestStart = false;
        this.alertService.error('A name is required!');
      }

    } else {
      this.requestStart = false;
      this.alertService.error('A name is required!');
    }
  }

  createRoom() {

  }

  fetchRooms(b: Building) {
    if (b.rooms.length === 0 ) {
      return;
    }
    this.requestStart = true;
    let requestCounter = 0;
    this.roomList = [];
    this.currentBuilding = b;
    for (const room of b.rooms) {
      this.roomService.getRoomById(room)
        .subscribe(
          next => {
            requestCounter ++;
            this.roomList.push(next);
            this.roomList.push(next);
            this.roomList.push(next);
            this.roomList.push(next);
            this.roomList.push(next);
            this.roomList.push(next);
            if (requestCounter === b.rooms.length) {
              this.requestStart = false;
            }
          }, error1 => {
            this.alertService.error('Error fetching rooms informations!');
            this.requestStart = false;
          }
        );
    }
  }
}
