import { Component, OnInit } from '@angular/core';
import {Sniffer} from '../_models/sniffer';
import {SnifferService} from '../_services/sniffer.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../_services/alert.service';

@Component({
  selector: 'app-sniffer-detail',
  templateUrl: './sniffer-detail.component.html',
  styleUrls: ['./sniffer-detail.component.css']
})
export class SnifferDetailComponent implements OnInit {

  sniffer: Sniffer;

  constructor(
    private snifferService: SnifferService,
    private route: ActivatedRoute,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.fetchSnifferDetails();
  }

  private fetchSnifferDetails() {
    this.snifferService.getSnifferById(this.route.snapshot.paramMap.get('id'))
      .subscribe(
        sniffer => {
          this.sniffer = sniffer;
        },
        error => {
          this.alertService.error('Impossible to fetch sniffer details!');
        }
      );
  }
}
