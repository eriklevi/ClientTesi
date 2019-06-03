import { Component, OnInit } from '@angular/core';
import {TrackingServiceService} from '../_services/tracking-service.service';
import {DeviceData} from '../_models/device-data';
import * as moment from 'moment';
import {Moment} from 'moment';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../_services/alert.service';
import {distinct, filter} from 'rxjs/operators';
import {from} from 'rxjs';
import {DeviceInfo} from '../_models/device-info';
import {DataRequestService} from '../_services/data-request.service';
import {TrackDataRequest} from '../_models/track-data-request';


@Component({
  selector: 'app-custom-selection-track',
  templateUrl: './custom-selection-track.component.html',
  styleUrls: ['./custom-selection-track.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
  ]
})
export class CustomSelectionTrackComponent implements OnInit {
  public group: FormGroup;
  public deviceMac: string;
  public devices: DeviceInfo[];
  public shownProducers: string[] = [];
  public maxDate;
  public fromDate;
  public showOui = false;
  public showMacs = false;
  public loading = false;
  public shownDevices: DeviceInfo[] = [];

  constructor(
    private trackingService: TrackingServiceService,
    private alertService: AlertService,
    private dataRequestService: DataRequestService
  ) {
    this.group = new FormGroup({
      'oui': new FormControl(null),
      'mac': new FormControl(null),
      'dataSingola': new FormControl(),
      'startTime': new FormControl('12:00'),
      'cambioData': new FormControl()
    })
    this.maxDate = moment().toDate();
    this.fromDate = this.maxDate;
  }

  ngOnInit() {
  }

  sendData() {
    const request = new TrackDataRequest();
    request.mac = this.group.get('mac').value.mac;
    const m: Moment = this.group.get('cambioData').value;
    const x = m.unix();
    const m1 = moment(x * 1000);
    m1.hour(0);
    request.timestampFrom = m1.unix() * 1000;
    request.timestampTo = m1.add(24, 'h').unix() * 1000;
    this.dataRequestService.updateTrackRequest(request);
  }

  fetchDevices() {
    this.shownProducers = [];
    this.loading = true;
    const m: Moment = this.group.get('dataSingola').value;
    const startTimeVector: number[] = this.group.get('startTime').value.split(':').map(n => parseInt(n, 10));
    m.hour(startTimeVector[0]);
    this.trackingService.getDistinctMacAsDeviceInfoByHour(m.unix() * 1000, m.add(1, 'h').unix() * 1000)
      .subscribe(
        next => {
          this.devices = next;
          from(this.devices).pipe(
            distinct( x => x.ouiName)
          ).subscribe(
            next1 => {
              this.shownProducers.push(next1.ouiCompleteName);
            }
          );
        }
        , error1 => {
          this.alertService.error('Impossible to fetch devices info!');
        }, () => {
          this.loading = false;
          this.showOui = true;
        }
      );
  }

  getShownDevices() {
    this.shownDevices = [];
    this.loading = true;
    from(this.devices).pipe(
      filter(x => x.ouiCompleteName === this.group.get('oui').value)
    ).subscribe(
      x => {
        this.shownDevices.push(x);
      },
      y => {
        this.alertService.error('Something went wrong!');
      },
      () => {
        this.shownDevices.sort( (mac1, mac2) => mac1.mac > mac2.mac ? 1 : -1);
        this.showMacs = true;
        this.loading = false;
      }
    );
  }
}
