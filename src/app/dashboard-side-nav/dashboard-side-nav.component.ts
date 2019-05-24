import { Component, OnInit } from '@angular/core';
import {SnifferService} from '../_services/sniffer.service';
import {AlertService} from '../_services/alert.service';

@Component({
  selector: 'app-dashboard-side-nav',
  templateUrl: './dashboard-side-nav.component.html',
  styleUrls: ['./dashboard-side-nav.component.css']
})
export class DashboardSideNavComponent implements OnInit {

  constructor(
    private sniffersService: SnifferService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
  }

  stopBroker() {

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
}
