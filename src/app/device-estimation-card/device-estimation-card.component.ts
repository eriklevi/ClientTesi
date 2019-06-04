import { Component, OnInit } from '@angular/core';
import {CountResult} from '../_models/countResult';
import {SnifferService} from '../_services/sniffer.service';
import {AlertService} from '../_services/alert.service';

@Component({
  selector: 'app-device-estimation-card',
  templateUrl: './device-estimation-card.component.html',
  styleUrls: ['./device-estimation-card.component.css']
})
export class DeviceEstimationCardComponent implements OnInit {

  displayedColumns = ['name', 'building', 'room', 'total'];
  lastCountedPackets: CountResult[];

  constructor(
    private snifferService: SnifferService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
  }

}
