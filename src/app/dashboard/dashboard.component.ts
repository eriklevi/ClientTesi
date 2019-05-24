import { Component, OnInit } from '@angular/core';
import {SnifferService} from '../_services/sniffer.service';
import {AlertService} from '../_services/alert.service';
import {CountedPacketsService} from '../_services/counted-packets.service';
import {Sniffer} from '../_models/sniffer';
import {ChartOptions, ChartType} from 'chart.js';
import {Label} from 'ng2-charts';
import {CountResult} from '../_models/countResult';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  mqttConnectedClients: string;
  snifferList: Sniffer[];
  loadingComplete = 0;
  displayedColumns = ['name', 'building', 'room', 'total'];
  lastCountedPackets: CountResult[];
  mqttClientsLoaded = false;

  constructor(
    private snifferService: SnifferService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.fetchConnectedClients();
    this.fetchSniffers();
  }

  private fetchConnectedClients() {
    this.snifferService.getConnectedSniffers().subscribe( data => {
        this.mqttConnectedClients = data;
        this.loadingComplete++;
        this.mqttClientsLoaded = true;
      }, error => {
        this.alertService.error('Unable to fetch connected clients!');
        this.loadingComplete++;
        this.mqttClientsLoaded = true;
    });
  }

  private fetchSniffers() {
    this.snifferService.getSniffers()
      .subscribe(
        data => {
          this.snifferList = data;
          this.loadingComplete++;
          // this.fetchLastEstimation();
        },
        error1 => {
          this.alertService.error('Impossible to fetch sniffer data');
          this.loadingComplete++;
        }
      );
  }

/*
  private fetchLastEstimation() {
    for (const s of this.snifferList) {
      this.countedPacketsService.getLastEstimationBySnifferId(s.id)
        .subscribe(
          data => {
            this.lastCountedPackets.push(data);
          }, error1 => {
            this.alertService.error('Impossible to fetch last estimation');
          }
        );
    }
  }*/
  stopBroker() {

  }
}
