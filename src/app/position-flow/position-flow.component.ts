import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FlowService} from '../_services/flow.service';
import {AlertService} from '../_services/alert.service';
import {PositionFlowData} from '../_models/position-flow-data';

declare const h337: any;

class DataPoint {
  x: number;
  y: number;
  value: number;
  radius: number;
}

class DataToVisualize {
  dataPoints: DataPoint[] = [];
}

@Component({
  selector: 'app-position-flow',
  templateUrl: './position-flow.component.html',
  styleUrls: ['./position-flow.component.css']
})
export class PositionFlowComponent implements OnInit, AfterViewInit {

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
  loaded = false;
  private completed: boolean = false;

  constructor(
    private flowService: FlowService,
    private alertservice: AlertService
  ) { }

  ngOnInit() {
    this.flowService.getPositionFlow(1560747600000, 1560754800000)
      .subscribe(
        data => {
          this.positionFlowData = data;
          this.loaded = true;
          console.log(this.positionFlowData);
        }, error1 => {
          this.alertservice.error('Impossible to fetch data!');
          this.loaded = true;
        }
      );
  }

  ngAfterViewInit() {
    this.heatmap = h337.create({
      container: window.document.querySelector('#heatmap')
    });
  }

  calculateDistance(rssi: number): number {
    return Math.pow(10, (rssi + 50) / -20);
  }

  getNagonPoints(n: number, radius: number, xc: number, yc: number): any[] {
    const points: any[] = [];
    for (let i = 0; i < n; i++ ) {
      const point = {
        x: (radius * Math.cos((i * 6.28) / n)) + xc,
        y: (radius * Math.sin((i * 6.28) / n)) + yc,
        value: 1 / n,
        radius: 40
      };
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
    for (let e of this.positionFlowData) {
      for (let dp of e.data) {
        const snifferPos = this.mapIdToXY(dp.snifferId);
        const dist = this.calculateDistance(dp.rssi);
        this.getNagonPoints( Math.ceil(dist / 2), dist, snifferPos.x, snifferPos.y)
          .map( elem => {
            this.dataToVisualize[e.minute] = {dataPoints: []};
            this.dataToVisualize[e.minute].dataPoints.push(elem);
          });
      }
    }
    this.completed = true;
  }

  visualize() {
    if (this.completed) {
      this.heatmap.setData({
        max: 1,
        data: this.dataToVisualize[this.fc++].dataPoints
      });
    }
  }
}
