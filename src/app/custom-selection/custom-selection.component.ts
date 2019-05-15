import {Component, NgModule, OnInit} from '@angular/core';
import {Sniffer} from '../_models/sniffer';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Building} from '../_models/building';
import {Room} from '../_models/room';
import {SnifferService} from '../_services/sniffer.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../_services/alert.service';
import {BuildingService} from '../_services/building.service';


@Component({
  selector: 'app-custom-selection',
  templateUrl: './custom-selection.component.html',
  styleUrls: ['./custom-selection.component.css']
})
export class CustomSelectionComponent implements OnInit {

  public group: FormGroup;
  public buildings: Building[];
  public rooms: Room[];
  public sniffers: Sniffer[];
  public shownSniffers: Sniffer[];
  public toggle = false;

  constructor(
    private snifferService: SnifferService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private buildingsService: BuildingService,
    private routes: Router
  ) {
    this.group = new FormGroup({
      'name': new FormControl(null),
      'building': new FormControl(null),
      'room': new FormControl(null),
      'startTime': new FormControl('00:00', Validators.required)
    });
  }

  ngOnInit() {
    this.fetchBuildings();
    this.fetchSniffers();
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

  otherFetchRooms(buildingId: string) {
    this.buildingsService.getRoomsByBuildingId(buildingId)
      .subscribe(
        data => {
          this.rooms = data;
        }, error => {
          this.alertService.error('Impossible to fetch room informations!');
        }
      );
  }

  fetchRooms(e) {
    this.buildingsService.getRoomsByBuildingId(e.source.value)
      .subscribe(
        data => {
          this.rooms = data;
        }, error => {
          this.alertService.error('Impossible to fetch room informations!');
        }
      );
  }

  private fetchSniffers() {
    this.snifferService.getSniffers()
      .subscribe(
        data => {
          this.sniffers = data;
          this.shownSniffers = data;
        }, error => {
          this.alertService.error('Unable to fetch sniffers informations!');
        }
      );
  }

  private updateSnifferList() {
    this.shownSniffers = this.sniffers;
    if (this.group.get('building').value) {
      this.shownSniffers = this.shownSniffers.filter(sniffer => sniffer.buildingId === this.group.get('building').value);
      if (this.group.get('room').value) {
        this.shownSniffers = this.shownSniffers.filter(sniffer => sniffer.roomId === this.group.get('room').value);
      }
    }
  }
}
