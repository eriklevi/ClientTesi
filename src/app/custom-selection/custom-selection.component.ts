import {Component, NgModule, OnInit} from '@angular/core';
import {Sniffer} from '../_models/sniffer';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Building} from '../_models/building';
import {Room} from '../_models/room';
import {SnifferService} from '../_services/sniffer.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../_services/alert.service';
import {BuildingService} from '../_services/building.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';

import * as moment from 'moment';
import {DataRequestService} from '../_services/data-request.service';
import {DataRequest} from '../_models/dataRequest';
import {Moment} from 'moment';

@Component({
  selector: 'app-custom-selection',
  templateUrl: './custom-selection.component.html',
  styleUrls: ['./custom-selection.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
  ]
})
export class CustomSelectionComponent implements OnInit {

  public group: FormGroup;
  public buildings: Building[];
  public rooms: Room[];
  public sniffers: Sniffer[];
  public shownSniffers: Sniffer[];
  public toggle = false;
  public maxDate;
  public fromDate;
  public dataSingolaActive = true;

  constructor(
    private snifferService: SnifferService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private buildingsService: BuildingService,
    private routes: Router,
    private dataRequestservice: DataRequestService
  ) {
    this.group = new FormGroup({
      'name': new FormControl(null),
      'building': new FormControl(null),
      'room': new FormControl(null),
      'startTime': new FormControl('00:00', Validators.required),
      'endTime': new FormControl('23:59', Validators.required),
      'dataSingola': new FormControl(null),
      'dataFrom': new FormControl(null),
      'dataTo': new FormControl(null),
      'resolution': new FormControl(null, Validators.required)
    });
    this.maxDate = moment().toDate();
    this.fromDate = this.maxDate;
  }

  ngOnInit() {
    this.fetchBuildings();
    this.fetchSniffers();
  }

  validateDataSingola() {
    if (this.toggle) {
      this.group.get('dataSingola').clearValidators();
      this.group.get('dataFrom').setValidators(Validators.required);
      this.group.get('dataTo').setValidators(Validators.required);
      this.group.get('dataSingola').reset();
    } else {
      this.group.get('dataSingola').setValidators(Validators.required);
      this.group.get('dataFrom').clearValidators();
      this.group.get('dataTo').clearValidators();
      this.group.get('dataFrom').reset();
      this.group.get('dataTo').reset();
    }
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

  sendData() {
    if (!this.group.valid) {
      this.alertService.error('Invalid Parameters!');
      return;
    }
    const request = new DataRequest(null, null, null, null, null, null, false);
    if (this.group.get('building').value) {
      request.buildingId = this.group.get('building').value;
      if (this.group.get('room').value) {
        request.roomId = this.group.get('room').value;
        if (this.group.get('name').value) {
          const s: Sniffer = this.sniffers.find( sn => sn.name === this.group.get('name').value);
          request.snifferName = s.name;
          request.buildingId = s.buildingId;
          request.roomId = s.roomId;
        }
      }
    } else {
      if (this.group.get('name').value) {
        const s: Sniffer = this.sniffers.find( sn => sn.name === this.group.get('name').value);
        request.snifferName = s.name;
        request.buildingId = s.buildingId;
        request.roomId = s.roomId;
      } else {
        this.alertService.error('Invalid selection!');
        return;
      }
    }
    if (!this.toggle) {
      /**
       * Parse and validate time
       */
      const momentFrom: Moment = this.group.get('dataSingola').value;
      const momentTo: Moment = this.group.get('dataSingola').value;
      const startTimeVector: number[] = this.group.get('startTime').value.split(':').map(n => parseInt(n, 10));
      const endTimeVector: number[] = this.group.get('endTime').value.split(':').map(n => parseInt(n, 10));
      if (endTimeVector[0] < startTimeVector[0]) {
        this.alertService.error('Invalid time selection!');
        return;
      }
      if (endTimeVector[0] === startTimeVector[0]) {
        if (endTimeVector[1] < startTimeVector[1]) {
          this.alertService.error('Invalid time selection!');
          return;
        }
      }
      momentFrom.hour(startTimeVector[0]);
      momentFrom.minute(startTimeVector[1]);
      request.fromTimestamp = momentFrom.unix() * 1000;
      momentTo.hour(endTimeVector[0]);
      momentTo.minute(endTimeVector[1]);
      request.toTimestamp = momentTo.unix() * 1000;
      console.log(request.fromTimestamp);
    } else {
      const momentFrom: Moment = this.group.get('dataFrom').value;
      const momentTo: Moment = this.group.get('dataTo').value;
      const startTimeVector: number[] = this.group.get('startTime').value.split(':').map(n => parseInt(n, 10));
      const endTimeVector: number[] = this.group.get('endTime').value.split(':').map(n => parseInt(n, 10));
      if (momentFrom.unix() === momentTo.unix()) {
        if (endTimeVector[0] < startTimeVector[0]) {
          this.alertService.error('Invalid time selection!');
          return;
        }
        if (endTimeVector[0] === startTimeVector[0]) {
          if (endTimeVector[1] < startTimeVector[1]) {
            this.alertService.error('Invalid time selection!');
            return;
          }
        }
      }
      momentFrom.hour(startTimeVector[0]);
      momentFrom.minute(startTimeVector[1]);
      request.fromTimestamp = momentFrom.unix() * 1000;
      momentTo.hour(endTimeVector[0]);
      momentTo.minute(endTimeVector[1]);
      request.toTimestamp = momentTo.unix() * 1000;
    }
    request.resolution = this.group.get('resolution').value;
    request.valid = true;
    this.dataRequestservice.updateRequest(request);
  }

  setFromMinDate() {
    this.fromDate = this.group.get('dataFrom').value;
  }

  setEndtimeMinValue() {
    return this.toggle ? '00:00' : this.group.get('startTime').value;
  }
}
