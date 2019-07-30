import { Component, OnInit } from '@angular/core';
import {SnifferService} from '../_services/sniffer.service';
import {AlertService} from '../_services/alert.service';
import {BrokerService} from '../_services/broker.service';

@Component({
  selector: 'app-dashboard-side-nav',
  templateUrl: './dashboard-side-nav.component.html',
  styleUrls: ['./dashboard-side-nav.component.css']
})
export class DashboardSideNavComponent implements OnInit {

  constructor(
    private sniffersService: SnifferService,
    private alertService: AlertService,
    private brokerService: BrokerService
  ) { }

  ngOnInit() {
  }

  resetSniffers() {
    this.sniffersService.resetSniffers()
      .subscribe(
        data => {
          this.alertService.success('Sniffers are resetting!');
        },
        error1 => {
          this.alertService.error('An error occurred during reset!\n' + error1.error);
        }
      );
  }

  startBroker() {
    this.brokerService.startBroker().subscribe(
      next => {
        this.alertService.success('MQTT Broker started!');
      },
      error1 => {
        this.alertService.success('Impossible to start the broker!');
      }
    );
  }

  stopBroker() {
    this.brokerService.stopBroker().subscribe(
      next => {
        this.alertService.success('MQTT Broker stopped!');
      },
      error1 => {
        this.alertService.success('Impossible to stop the broker!');
      }
    );
  }
}
