import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';
import {Subscription} from 'rxjs';
import {CountedPacketsService} from '../_services/counted-packets.service';
import {AlertService} from '../_services/alert.service';
import {DataRequestService} from '../_services/data-request.service';
import {DataRequest} from '../_models/dataRequest';
import * as moment from 'moment';

@Component({
  selector: 'app-compare-chart',
  templateUrl: './compare-chart.component.html',
  styleUrls: ['./compare-chart.component.css']
})
export class CompareChartComponent implements OnInit, OnDestroy {

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {xAxes: [{}], yAxes: [{}]}
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataSets[] = [];
  public barChartPlugins = [];
  dataReady = false;
  private subscription: Subscription;
  private resetChartSubscription: Subscription;

  constructor(
    private countedPacketsService: CountedPacketsService,
    private alertService: AlertService,
    private dataRequestService: DataRequestService
  ) { }

  ngOnInit() {
    this.subscription = this.dataRequestService.getRequestBehaviourSubject().subscribe(
      req => {
        if (req.valid) {
          this.loadData(req);
        }
      }, error => {
        console.log('errore!');
      });
    this.resetChartSubscription = this.dataRequestService.getResetChart()
      .subscribe(
        req => {
          this.barChartData = [];
          this.barChartLabels = [];
          this.dataReady = false;
        }
      );
  }

  loadData(req: DataRequest) {
    console.log(req);
    this.countedPacketsService.getCountedPacketsBySniffer(req.buildingId
      , req.roomId
      , req.snifferName
      , req.fromTimestamp
      , req.toTimestamp
      , req.resolution).subscribe(
      next => {
        this.barChartData.push({data: next.map(item => item.avgEstimatedDevices), label: req.snifferName});
        this.barChartLabels = next.map( item => {
          return moment(item.startTimestamp).locale('it').format('llll').toString();
        });
        this.dataReady = true;
      },
      error => {
        this.alertService.error('Unable to fetch data!');
      }
    );
    console.log(this.barChartData);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
