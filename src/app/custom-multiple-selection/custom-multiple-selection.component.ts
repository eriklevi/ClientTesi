import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Building} from '../_models/building';
import {Room} from '../_models/room';
import {Sniffer} from '../_models/sniffer';
import {SnifferService} from '../_services/sniffer.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../_services/alert.service';
import {BuildingService} from '../_services/building.service';
import {DataRequestService} from '../_services/data-request.service';
import * as moment from 'moment';
import {DataRequest} from '../_models/dataRequest';
import {Moment} from 'moment';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';

@Component({
  selector: 'app-custom-multiple-selection',
  templateUrl: './custom-multiple-selection.component.html',
  styleUrls: ['./custom-multiple-selection.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
  ]
})
export class CustomMultipleSelectionComponent implements OnInit {

  public group: FormGroup;
  public buildings: Building[];
  public rooms: Room[];
  public sniffers: Sniffer[];
  public shownSniffers: Sniffer[];
  public toggle = false;
  public maxDate;
  public fromDate;
  public dataSingolaActive = true;
  public selectedSniffersList: Sniffer[] = [];
  public selectedSniffer: Sniffer;

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

  sendData(s: Sniffer): void {
    if (!this.group.valid) {
      this.alertService.error('Invalid Parameters!');
      return;
    }
    const request = new DataRequest(null, null, null, null, null, null, false);
    request.buildingId = s.buildingId;
    request.roomId = s.roomId;
    request.snifferId = s.id;
    request.type = 'sniffer'
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

  remove(s: Sniffer): void {
      const index = this.selectedSniffersList.findIndex(s1 => s1.id === s.id);
      if (index >= 0) {
        this.sniffers.push(this.selectedSniffersList.splice(index, 1)[0]);
    }
  }

  addSnifferToSelectedSniffers() {
    const index = this.sniffers.findIndex(s1 => s1.id === this.selectedSniffer.id);
    this.selectedSniffersList.push(this.sniffers.splice(index, 1)[0]);
    this.selectedSniffer = undefined;
  }

  prepareData() {
    this.dataRequestservice.resetChartRequest();
    if (this.selectedSniffersList.length < 2) {
      this.alertService.error('Select at least two sniffers!');
      return;
    }
    for (const s of this.selectedSniffersList) {
      this.sendData(s);
    }
  }

  resetAll() {
    this.group.reset();
    for (const s of this.selectedSniffersList) {
      this.sniffers.push(s);
    }
    this.selectedSniffersList = [];
  }
}
