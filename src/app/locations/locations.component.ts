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
        b.name = s;
        this.name = '';
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
    this.requestStart = true;
    if (!this.roomName) {
      this.requestStart = false;
      this.alertService.error('A name is required!');
      return;
    }
    const s = this.roomName.trim();
    if (s && s !== '') {
      const room: Room = new Room();
      room.name = s;
      this.roomName = '';
      this.buildingService.addRoomToBuildingById(this.currentBuilding.id, room).subscribe(
        next => {
          this.alertService.success('Room ' +  room.name + ' correctly added to building ' + this.currentBuilding.name);
          this.buildingService
            .getBuildings()
            .subscribe(
              data => {
                this.buildingList = data;
                const building = this.buildingList.find(b => b.id === this.currentBuilding.id);
                if (building) {
                  this.currentBuilding = building;
                  this.fetchRooms(building);
                } else {
                  // questo event non dovrebbe capitare mai
                  this.alertService.error('No building matching!');
                }
              }, error1 => {
                this.requestStart = false;
                this.alertService.error('Impossible to fetch building ' + this.currentBuilding.name + ' info after update!')
              }
            );
            }, error1 => {
          this.alertService.error('Impossible to add the new room!');
          this.requestStart = false;
        }
      );
    } else {
      this.requestStart = false;
      this.alertService.error('A name is required!');
    }
  }

  fetchRooms(b: Building) {
    this.currentBuilding = b;
    if (!b.rooms) {
      this.roomList = [];
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
