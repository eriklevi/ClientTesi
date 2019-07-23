import {AfterViewInit, Component, ElementRef, OnInit, Pipe, PipeTransform, ViewChild} from '@angular/core';
import {FlowService} from '../_services/flow.service';
import {AlertService} from '../_services/alert.service';
import {PositionFlowData} from '../_models/position-flow-data';
import {FormControl, FormGroup} from '@angular/forms';
import * as moment from 'moment';
import {Moment} from 'moment';
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
  selector: 'app-flow3',
  templateUrl: './flow3.component.html',
  styleUrls: ['./flow3.component.css']
})
export class Flow3Component implements OnInit , AfterViewInit {

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
  private ctx: CanvasRenderingContext2D;
  private t: any;
  showTime = false;
  private heatmapMax: number = 100;



  constructor(
    private flowService: FlowService,
    private alertservice: AlertService,
  ) {
    this.group = new FormGroup({
      'dataSingola': new FormControl(),
      'startTime': new FormControl('12:00'),
      'aggregationLevel': new FormControl(1)
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
    return (Math.pow(10, (rssi + 50) / -20)) * 14;
  }

  getNagonPoints(n: number, radius: number, xc: number, yc: number, id: string): any {
    const points: any[] = [];
    return {
      x : xc,
      y : yc,
      value: Math.round(this.heatmapMax * 200 * (this.group.get('aggregationLevel').value === 1 ? 1 : this.group.get('aggregationLevel').value/2) / (radius /* * (this.group.get('aggregationLevel').value === 1 ? 1 : this.group.get('aggregationLevel').value)*/)),
      snifferId: id,
      radius : radius
    };
    /*
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
    */
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
    for (let e of this.positionFlowData) {
      if (!this.dataToVisualize[e.minute]) {
        this.dataToVisualize[e.minute] = {dataPoints: []};
      }
      for (let dp of e.data) {
        const snifferPos = this.mapIdToXY(dp.snifferId);
        const dist = this.calculateDistance(dp.rssi);
        this.dataToVisualize[e.minute].dataPoints.push(this.getNagonPoints( Math.ceil(dist / 2), dist, snifferPos.x, snifferPos.y, dp.snifferId));
      }
    }
    this.completed = true;
  }

  /*
  visualize() {
    if (this.completed && this.fc < this.dataToVisualize.length) {
      this.heatmap.setData({
        max: 100,
        min: 0,
        data: this.dataToVisualize[this.fc++].dataPoints
      });
    }
  }*/

  visualizeNext() {
    this.showTime = true;
    let devicesum = 0;
    if (this.completed && this.fc < this.dataToVisualize.length) {
      this.ctx.fillStyle = 'rgba(255 ,255, 255, 0)';
      this.ctx.clearRect(0, 0, 1000, 185);
      this.t = formatNumber(this.positionFlowData[this.fc].hour, 'en-US', '2.0-0') + ':' + formatNumber(this.positionFlowData[this.fc].minute, 'en-US', '2.0-0');
      const aggregatedDataToVisualize: DataPoint[] = [];
      for (let k = 0; k < this.group.get('aggregationLevel').value; k++) {
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
        this.dataToVisualize[this.fc].dataPoints.map( elem => aggregatedDataToVisualize.push(elem));
        devicesum += this.dataToVisualize[this.fc].dataPoints.length;
        this.fc ++;
      }
      this.heatmap.setData({
        max: this.heatmapMax * devicesum,
        min: 0,
        data: aggregatedDataToVisualize
      });
    }
  }

  visualizePrevious() {
    if (this.fc < 2) {
      return;
    }
    this.fc -= this.group.get('aggregationLevel').value ;
    if (this.completed && this.fc >= 0) {
      this.showTime = true;
      let devicesum = 0;
      if (this.completed && this.fc < this.dataToVisualize.length) {
        this.ctx.fillStyle = 'rgba(255 ,255, 255, 0)';
        this.ctx.clearRect(0, 0, 1000, 185);
        this.t = formatNumber(this.positionFlowData[this.fc].hour, 'en-US', '2.0-0') + ':' + formatNumber(this.positionFlowData[this.fc].minute, 'en-US', '2.0-0');
        const aggregatedDataToVisualize: DataPoint[] = [];
        for (let k = 0; k < this.group.get('aggregationLevel').value; k++) {
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
          this.dataToVisualize[this.fc].dataPoints.map( elem => aggregatedDataToVisualize.push(elem));
          devicesum += this.dataToVisualize[this.fc].dataPoints.length;
          this.fc ++;
        }
        this.heatmap.setData({
          max: this.heatmapMax * devicesum,
          min: 0,
          data: aggregatedDataToVisualize
        });
      }
    }
  }

  fetchData() {
    this.fc = 0;
    /**
     * Reset heatmap
     */
    this.heatmap.setData({
      max: 100,
      min: 0,
      data: []
    });
    /**
     * Reset canvas
     */
    this.ctx.fillStyle = 'rgba(255 ,255, 255, 0)';
    this.ctx.clearRect(0, 0, 1000, 185);
    this.requestStart = true;
    this.loaded = false;
    const m: Moment = this.group.get('dataSingola').value;
    const startTimeVector: number[] = this.group.get('startTime').value.split(':').map(n => parseInt(n, 10));
    m.hour(startTimeVector[0]);
    this.flowService.getPositionFlow(m.unix() * 1000, m.add(1, 'h').unix() * 1000)
      .subscribe(
        data => {
          this.positionFlowData = data;
          this.play();
          this.loaded = true;
          console.log(this.positionFlowData);
          this.requestStart = false;
        }, error1 => {
          this.alertservice.error('Impossible to fetch data!');
          this.loaded = true;
          this.requestStart = false;
        }
      );
  }
}
