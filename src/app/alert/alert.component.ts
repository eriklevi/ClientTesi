import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertService } from '../_services/alert.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-alert',
  templateUrl: 'alert.component.html'
})

export class AlertComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  message: any;

  constructor(private alertService: AlertService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.subscription = this.alertService.getMessage().subscribe(message => {
      this.message = message;
      this.snackBar.open(this.message.text, 'OK', {duration: this.message.duration});
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
