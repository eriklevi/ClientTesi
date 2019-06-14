import {AfterViewInit, Component, NgModule, OnInit} from '@angular/core';
import {FlowService} from '../_services/flow.service';
import {FlowData} from '../_models/flow-data';
import {from, Observable, of} from 'rxjs';
import {concatMap, delay, mergeMap} from 'rxjs/operators';

import * as moment from 'moment';
import {Moment} from 'moment';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatSliderChange} from '@angular/material';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';

declare const h337: any;

@Component({
  selector: 'app-flow-map',
  templateUrl: './flow-map.component.html',
  styleUrls: ['./flow-map.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
  ]
})
export class FlowMapComponent implements OnInit, AfterViewInit {

  private flowData: FlowData[] = [];
  private maxHeat: number;
  private showHeatMap = false;
  private heatmap: any;
  from: number;
  to: number;
  currentValue: number;
  time: string;
  disableSlider = false;

  constructor(
    private flowService: FlowService
  ) { }

  ngOnInit() {
    this.from = 0;
    this.flowService.getFlow(1559685600000, 1559772000000).subscribe(
      data => {
        this.flowData = data;
        let max = 0;
        data.forEach( element => {
          element.heat.forEach(
            element1 => {
              if ( element1 > max ) {
                max = element1;
              }
            }
          );
        });
        this.maxHeat = max;
        this.showHeatMap = true;
        this.to = this.flowData.length;
      }
    );
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

  updateHeatMap(flowData: FlowData) {
    const heat = flowData.heat;
    const ids = flowData.snifferId;
    const macs = flowData.distinctMacs;
    const fp = flowData.distinctFingerprints
    const points: any = [];
    for ( let i in ids) {
      points.push({
        x: this.mapIdToXY(ids[i]).x,
        y: this.mapIdToXY(ids[i]).y,
        value: heat[i],
        radius: 120
      });
    }
    this.heatmap.setData({
      max: this.maxHeat,
      data: points
    });
  }

  ngAfterViewInit() {
    this.heatmap = h337.create({
      container: window.document.querySelector('#heatmap')
    });
    const nuConfig = {
      radius: 120
    };
    this.heatmap.configure(nuConfig);
  }

  next() {
    Observable.create(obs => {
      obs.next(this.flowData);
      obs.complete();
    })
      .pipe(
        // make observable to emit each element of the array (not the whole array)
        mergeMap((x: [any]) => from(x)),
        // delay each element by 1 sec
        concatMap(x => of(x).pipe(delay(150)))
      )
      .subscribe(x => {
        this.updateHeatMap(x);
        this.currentValue = this.flowData.indexOf(x);
        this.time = moment({
          y: x.year
          , M: x.month - 1
          , d: x.dayOfMonth
          , h: x.hour
          , m: (x.fiveMinute - 1) * 5
        }).locale('it').format('llll').toString();
      });
  }

  onInputChange(event: MatSliderChange) {
    console.log('This is emitted as the thumb slides');
    console.log(event.value);
    const x = this.flowData[event.value];
    this.updateHeatMap(x);
    this.time = moment({
      y: x.year
      , M: x.month - 1
      , d: x.dayOfMonth
      , h: x.hour
      , m: (x.fiveMinute - 1) * 5
    }).locale('it').format('llll').toString();
  }
}
