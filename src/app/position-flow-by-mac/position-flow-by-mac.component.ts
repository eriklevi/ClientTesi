import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FlowService} from '../_services/flow.service';
import {AlertService} from '../_services/alert.service';
import {PositionFlowData} from '../_models/position-flow-data';
import {FormControl, FormGroup} from '@angular/forms';
import * as moment from 'moment';
import {Moment} from 'moment';
import {from} from 'rxjs';
import {distinct, filter} from 'rxjs/operators';
import {TrackingServiceService} from '../_services/tracking-service.service';
import {DeviceInfo} from '../_models/device-info';
import {isWhiteSpace} from 'tslint';
import {formatNumber} from '@angular/common';

declare const h337: any;

class DataPoint {
  x: number;
  y: number;
  value: number;
  radius: number;
  snifferId: string;
}

class DataToVisualize {
  dataPoints: DataPoint[] = [];
}

@Component({
  selector: 'app-position-flow-by-mac',
  templateUrl: './position-flow-by-mac.component.html',
  styleUrls: ['./position-flow-by-mac.component.css']
})
export class PositionFlowByMacComponent implements OnInit, AfterViewInit {

  @ViewChild('myCanvas') canvasRef: ElementRef;
  private positionFlowData: PositionFlowData[];
  private dataToVisualize: DataToVisualize[] = [];
  private maxHeat: number;
  private heatmap: any;
  private fc: number = 0;
  from: number;
  to: number;
  currentValue: number;
  time: string;
  disableSlider = false;
  requestStart = false;
  loaded = false;
  private completed: boolean = false;
  private group: FormGroup;
  private maxDate: any;
  private fromDate: any;
  private shownProducers: any[];
  private loading: boolean;
  private showOui: boolean;
  private showMacs: boolean;
  public devices: DeviceInfo[];
  public shownDevices: DeviceInfo[] = [];
  private t: any;
  private ctx: CanvasRenderingContext2D;
  showTime = false;

  constructor(
    private flowService: FlowService,
    private trackingService: TrackingServiceService,
    private alertService: AlertService,
  ) {
    this.group = new FormGroup({
      'dataSingola': new FormControl(),
      'startTime': new FormControl('12:00'),
      'oui': new FormControl(null),
      'mac': new FormControl(null),
      'cambioData': new FormControl()
    })
    this.maxDate = moment().toDate();
    this.fromDate = this.maxDate;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.heatmap = h337.create({
      container: window.document.querySelector('#heatmap')
    });
   this.ctx = this.canvasRef.nativeElement.getContext('2d');
  }

  calculateDistance(rssi: number): number {
    return Math.round((Math.pow(10, (rssi + 50) / -20)) * 14);
  }

  getNagonPoints(n: number, radius: number, xc: number, yc: number, id: string): any[] {
    const points: any[] = [];
    for (let i = 0; i < n; i++ ) {
      let point = {};
      if (radius / 14 <= 6) {
        point = {
          x: Math.round((radius * Math.cos((i * 2 * Math.PI) / n)) + xc),
          y: Math.round((radius * Math.sin((i * 2 * Math.PI) / n)) + yc),
          value: 100 / n,
          radius: 3 * 14,
          snifferId: id
        };
      }
      if (radius / 14 > 6 && radius / 14 <= 12) {
        point = {
          x: Math.round((radius * Math.cos((i * 2 * Math.PI) / n)) + xc),
          y: Math.round((radius * Math.sin((i * 2 * Math.PI) / n)) + yc),
          value: 100 / n,
          radius: 4 * 14,
          snifferId: id
        };
      }
      if (radius / 14 > 12 && radius / 14 <= 20) {
        point = {
          x: Math.round((radius * Math.cos((i * 2 * Math.PI) / n)) + xc),
          y: Math.round((radius * Math.sin((i * 2 * Math.PI) / n)) + yc),
          value: Math.round(100 / n),
          radius: 8 * 14,
          snifferId: id
        };
      }
      points.push(point);
    }
    return points;
  }

  mapIdToXY(id: string): any {
    switch (id) {
      case '5c64309d8d074152f93b5231':
        return {x: 783, y: 78};
      case '5cd45fa09469df2250bfe3a3':
        return {x: 559, y: 119};
      case '5cd588a89194be0001367cdf':
        return {x: 962, y: 176};
      case '5cdc21480e8e3d0001a471aa':
        return {x: 287, y: 116};
    }
  }

  play() {
    this.dataToVisualize = [];
    for (let e in this.positionFlowData) {
      if (!this.dataToVisualize[e]) {
        this.dataToVisualize[e] = {dataPoints: []};
      }
      for (let dp of this.positionFlowData[e].data) {
        const snifferPos = this.mapIdToXY(dp.snifferId);
        const dist = this.calculateDistance(dp.rssi);
        this.getNagonPoints( Math.ceil(dist / 2), dist, snifferPos.x, snifferPos.y, dp.snifferId)
          .map( elem => {
            if (elem.x <= 1000 && elem.y <= 185 && elem.x >= 0 && elem.y >= 0) {
              this.dataToVisualize[e].dataPoints.push(elem);
            }
          });
      }
    }
    this.completed = true;
  }

  visualizeNext() {
    this.showTime = true;
    if (this.completed && this.fc < this.dataToVisualize.length) {
      this.ctx.fillStyle = 'rgba(255 ,255, 255, 0)';
      this.ctx.clearRect(0, 0, 1000, 185);
      this.heatmap.setData({
        max: 100,
        min: 0,
        data: this.dataToVisualize[this.fc].dataPoints
      });
      this.t = formatNumber(this.positionFlowData[this.fc].hour, 'en-US', '2.0-0') + ':' + formatNumber(this.positionFlowData[this.fc].minute, 'en-US', '2.0-0');
      for (const el of this.dataToVisualize[this.fc].dataPoints) {
        switch (el.snifferId) {
          case '5c64309d8d074152f93b5231':
            this.ctx.fillStyle = 'rgb(255 ,0, 0)';
            break;
          case '5cd45fa09469df2250bfe3a3':
            this.ctx.fillStyle = 'rgb(0,255,0)';
            break;
          case '5cd588a89194be0001367cdf':
            this.ctx.fillStyle = 'rgb(0 ,0, 255)';
            break;
          case '5cdc21480e8e3d0001a471aa':
            this.ctx.fillStyle = 'rgb(255 ,0, 255)';
            break;
        }
        this.ctx.fillRect(el.x - 3, el.y - 3, 3, 3);
      }
      this.fc ++;
     }
  }

  visualizePrevious() {
    if (this.fc < 2) {
      return;
    }
    this.fc -= 2;
    if (this.completed && this.fc >= 0) {
      this.ctx.fillStyle = 'rgba(255 ,255, 255, 0)';
      this.ctx.clearRect(0, 0, 1000, 185);
      this.heatmap.setData({
        max: 100,
        min: 0,
        data: this.dataToVisualize[this.fc].dataPoints
      });
      this.t =  formatNumber(this.positionFlowData[this.fc].hour, 'en-US', '2.0-0')  + ':' + formatNumber(this.positionFlowData[this.fc].minute, 'en-US', '2.0-0');
      for (const el of this.dataToVisualize[this.fc].dataPoints) {
        switch (el.snifferId) {
          case '5c64309d8d074152f93b5231':
            this.ctx.fillStyle = 'rgb(255 ,0, 0)';
            break;
          case '5cd45fa09469df2250bfe3a3':
            this.ctx.fillStyle = 'rgb(0,255,0)';
            break;
          case '5cd588a89194be0001367cdf':
            this.ctx.fillStyle = 'rgb(0 ,0, 255)';
            break;
          case '5cdc21480e8e3d0001a471aa':
            this.ctx.fillStyle = 'rgb(255 ,0, 255)';
            break;
        }
        this.ctx.fillRect(el.x - 3, el.y - 3, 3, 3);
      }
      this.fc ++;
    }
  }

  fetchData() {
    this.showTime = false;
    if (!this.group.get('mac').value) {
      this.alertService.error('Invalid selection!');
      return;
    }
    this.fc = 0;
    this.ctx.fillStyle = 'rgba(255 ,255, 255, 0)';
    this.ctx.clearRect(0, 0, 1000, 185);
    this.heatmap.setData({
      max: 100,
      min: 0,
      data: []
    });
    this.requestStart = true;
    this.loaded = false;
    const m: Moment = this.group.get('cambioData').value;
    const x = m.unix();
    const m1 = moment(x * 1000);
    m1.hour(0);
    const timestampFrom = m1.unix() * 1000;
    const timestampTo = m1.add(24, 'h').unix() * 1000;
    this.flowService.getPositionFlowByMac(timestampFrom, timestampTo, this.group.get('mac').value.mac)
      .subscribe(
        data => {
          this.positionFlowData = data;
          this.play();
          this.loaded = true;
          console.log(this.positionFlowData);
          this.requestStart = false;
        }, error1 => {
          this.alertService.error('Impossible to fetch data!');
          this.loaded = true;
          this.requestStart = false;
        }
      );
  }

  fetchDevices() {
    this.shownProducers = [];
    this.requestStart = true;
    this.loading = true;
    this.showOui = false;
    this.showMacs = false;
    const m: Moment = this.group.get('dataSingola').value;
    const startTimeVector: number[] = this.group.get('startTime').value.split(':').map(n => parseInt(n, 10));
    m.hour(startTimeVector[0]);
    this.group.get('cambioData').setValue(this.group.get('dataSingola').value);
    this.trackingService.getDistinctMacAsDeviceInfoByHour(m.unix() * 1000, m.add(1, 'h').unix() * 1000)
      .subscribe(
        next => {
          this.devices = next;
          from(this.devices).pipe(
            distinct( x => x.ouiName)
          ).subscribe(
            next1 => {
              this.shownProducers.push(next1.ouiCompleteName);
              this.requestStart = false;
            }
          );
        }
        , error1 => {
          this.loading = false;
          this.requestStart = false;
          this.alertService.error('Impossible to fetch devices info!');
        }, () => {
          this.loading = false;
          this.showOui = true;
          this.requestStart = false;
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
        this.loading = false;
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

