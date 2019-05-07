import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Building} from '../_models/building';
import {Room} from '../_models/room';
import {SnifferService} from '../_services/sniffer.service';
import {BuildingService} from '../_services/building.service';
import {AlertService} from '../_services/alert.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-room-creator',
  templateUrl: './room-creator.component.html',
  styleUrls: ['./room-creator.component.css']
})
export class RoomCreatorComponent implements OnInit {

  public group: FormGroup;
  public buildings: Building[];

  constructor(
    private snifferService: SnifferService,
    private buildingsService: BuildingService,
    private alertService: AlertService,
    private  router: Router
  ) {
    this.group = new FormGroup({
      'name': new FormControl('', Validators.compose([Validators.required])),
      'building': new FormControl('', Validators.compose([Validators.required])),
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

  createRoom() {
    if (this.group.invalid) {
      return;
    }
    const r: Room = new Room();
    r.name = this.group.get('name').value;
    const buildingId: string = this.group.get('building').value;
    this.buildingsService.addRoomToBuildingById(buildingId, r)
      .subscribe(
        data => {
          this.alertService.success('Room Added!');
          this.router.navigate(['/dashboard']);
        }, error => {
          this.alertService.error('Error during room creation!');
        }
      );
  }

}
