import {Component, NgModule, OnInit} from '@angular/core';
import { NgxHeatMapModule } from 'ngx-heatmap';

@NgModule({
  imports: [
    NgxHeatMapModule
  ]
})
@Component({
  selector: 'app-flow-map',
  templateUrl: './flow-map.component.html',
  styleUrls: ['./flow-map.component.css']
})
export class FlowMapComponent implements OnInit {

  private HeatmapConfig = {
    defaultRadius: 40,
    defaultRenderer: 'canvas2d',
    defaultGradient: { 0.25: 'rgb(0,0,255)', 0.55: 'rgb(0,255,0)', 0.85: 'yellow', 1.0: 'rgb(255,0,0)'},
    defaultMaxOpacity: 1,
    defaultMinOpacity: 0,
    defaultBlur: .85,
    defaultXField: 'x',
    defaultYField: 'y',
    defaultValueField: 'value',
    plugins: {}
  };
  private data: any = {x: 1, y: 1, value: 10};
  private height = 400;
  private width = 400;

  constructor() { }

  ngOnInit() {
  }

}
