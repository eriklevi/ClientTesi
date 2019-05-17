import { Component, OnInit } from '@angular/core';
import {SnifferService} from '../_services/sniffer.service';
import {AlertService} from '../_services/alert.service';
import {CountedPacketsService} from '../_services/counted-packets.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private showCustomSelection = false;
  chartWidth = 100;
  mqttConnectedClients: string;
  totalParsedPackets: number;

  constructor(
    private snifferService: SnifferService,
    private alertService: AlertService,
    private countedPacketsService: CountedPacketsService
  ) { }

  ngOnInit() {
    this.fetchConnectedClients();
    this.fetchTotalParsedPacketsStats();
  }

  toggleCustomSelection() {
    this.showCustomSelection = !this.showCustomSelection;
    this.showCustomSelection ? this.chartWidth = 80 : this.chartWidth = 100;
  }

  private fetchConnectedClients() {
    this.snifferService.getConnectedSniffers().subscribe( data => {
        this.mqttConnectedClients = data;
      }, error => {
        this.alertService.error('Unable to fetch connected clients!');
    });
  }
}
