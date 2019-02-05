import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Sniffer} from '../_models/sniffer';
import {SnifferService} from '../_services/sniffer.service';
import {BuildingService} from '../_services/building.service';
import {Building} from '../_models/building';
import {Room} from '../_models/room';
import {RoomService} from '../_services/room.service';

@Component({
  selector: 'app-sniffer-creator',
  templateUrl: './sniffer-creator.component.html',
  styleUrls: ['./sniffer-creator.component.css']
})
export class SnifferCreatorComponent implements OnInit {

  public group: FormGroup;
  public buildings: Building[];
  public rooms: Room[];

  constructor(
      private snifferService: SnifferService,
      private buildingsService: BuildingService,
      private roomService: RoomService
  ) {
    this.group = new FormGroup({
      'mac': new FormControl('', Validators.compose([Validators.required, Validators.pattern('^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$')])),
      'name': new FormControl('', Validators.compose([Validators.required])),
      'building': new FormControl('', Validators.compose([Validators.required])),
      'room': new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.fetchBuildings();
  }

  fetchBuildings() {
    this.buildingsService.getBuildings()
      .subscribe(
        data => {
          this.buildings = data;
        }, error => {
          console.error(error.name);
        }
      );
  }

  fetchRooms(e) {
    this.buildingsService.getRoomsByBuildingId(e.source.value)
      .subscribe(
        data => {
          this.rooms = data;
        }, error => {
          console.error(error);
        }
      );
  }

  createSniffer() {
    if (this.group.invalid) {
    return;
    }
    const s: Sniffer = new Sniffer();
    s.mac = this.group.get('mac').value;
    s.name = this.group.get('name').value;
    s.building = this.group.get('building').value;
    s.room = this.group.get('room').value;
    this.snifferService.createSniffer(s).subscribe(
      data => {
        console.log('Nuovo sniffer creato');
      }, error => {
        console.log(error.name);
      }
    );
  }
}
