import {AfterViewInit, Component, NgModule, OnInit} from '@angular/core';

declare const h337: any;

@Component({
  selector: 'app-flow-map',
  templateUrl: './flow-map.component.html',
  styleUrls: ['./flow-map.component.css']
})
export class FlowMapComponent implements OnInit, AfterViewInit {

  ngAfterViewInit() {
    const heatmap = h337.create({
      container: window.document.querySelector('#heatmap')
    });

    heatmap.setData({
      max: 20,
      data: [{x: 500, y: 175, value: 20}, {x: 400, y: 175, value: 20}, {x: 600, y: 175, value: 20}, {x: 500, y: 100, value: 20}]
    });
  }

  constructor() { }

  ngOnInit() {
  }




}
