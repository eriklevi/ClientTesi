import {Component, OnInit, ViewChild} from '@angular/core';
import {CountResult} from '../_models/countResult';
import {SnifferService} from '../_services/sniffer.service';
import {AlertService} from '../_services/alert.service';
import {Sniffer} from '../_models/sniffer';
import {CountedPacketsService} from '../_services/counted-packets.service';
import {MatTable} from '@angular/material';
import {CountResultMean} from '../_models/count-result-mean';
import * as moment from 'moment';

@Component({
  selector: 'app-device-estimation-card',
  templateUrl: './device-estimation-card.component.html',
  styleUrls: ['./device-estimation-card.component.css']
})
export class DeviceEstimationCardComponent implements OnInit {

  displayedColumns: string[] = ['name', 'building', 'room', 'time', 'total', 'mean'];
  snifferList: Sniffer[];
  lastCountedPackets: CountResult[] = [];
  means: CountResultMean[] = [];
  loaded = false;
  @ViewChild(MatTable) table: MatTable<any>;

  constructor(
    private snifferService: SnifferService,
    private alertService: AlertService,
    private countedPacketsService: CountedPacketsService
  ) { }

  ngOnInit() {
    this.fetchSniffers();
  }

  fetchSniffers() {
    this.snifferService.getSniffers().subscribe(
      data => {
        this.snifferList = data;
        this.fetchEstimation();
        this.loaded = true;
      },
      error1 => {
        this.alertService.error('Impossible to retrive sniffers!');
        this.loaded = true;
      }
    );
  }

  fetchEstimation() {
    const time =  new Date().getTime();
    for (const s of this.snifferList) {
      this.countedPacketsService.getLastEstimationBySnifferId(s.id)
        .subscribe(
          data1 => {
            this.countedPacketsService.getMeanBySnifferId(s.id, data1.startTimestamp)
              .subscribe(
                data2 => {
                  data1.mean = data2.mean;
                  this.lastCountedPackets.push(data1);
                  this.table.renderRows();
                },
                errore => {
                  this.alertService.error('Impossible to retrive ' + s.name + ' last estimation!');
                  this.loaded = true;
                }
              );
          },
          error1 => {
            this.alertService.error('Impossible to retrive ' + s.name + ' last estimation!');
            this.loaded = true;
          },
        );
    }
  }

  getTimestampAsZonedString(timestamp: number): string {
    return moment(timestamp).locale('it').format('llll').toString();
  }
}
