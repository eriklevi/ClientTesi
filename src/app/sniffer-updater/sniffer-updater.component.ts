import { Component, OnInit } from '@angular/core';
import {Sniffer} from '../_models/sniffer';
import {SnifferService} from '../_services/sniffer.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../_services/alert.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Building} from '../_models/building';
import {Room} from '../_models/room';
import {Configuration} from '../_models/configuration';
import {BuildingService} from '../_services/building.service';
import {MAT_DATEPICKER_VALIDATORS} from '@angular/material';

@Component({
  selector: 'app-sniffer-updater',
  templateUrl: './sniffer-updater.component.html',
  styleUrls: ['./sniffer-updater.component.css']
})
export class SnifferUpdaterComponent implements OnInit {

  sniffer: Sniffer;
  public group: FormGroup;
  public buildings: Building[];
  public rooms: Room[];

  constructor(
    private snifferService: SnifferService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private buildingsService: BuildingService,
    private routes: Router
  ) {
    this.group = new FormGroup({
      'mac': new FormControl(null, Validators.compose([Validators.required, Validators.pattern('^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$')])),
      'name': new FormControl(null, Validators.compose([Validators.required])),
      'brokerAddress': new FormControl(null, Validators.compose([Validators.required, Validators.pattern('^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$')])),
      'brokerPort': new FormControl(null, Validators.compose([Validators.required, Validators.max(65535), Validators.min(1)])),
      'lwt': new FormControl(null, Validators.required),
      'lwtm': new FormControl(null, Validators.required),
      'topic': new FormControl(null, Validators.required),
      'dump': new FormControl(null, Validators.required),
      'privacy': new FormControl(null, Validators.required),
      'thrashold': new FormControl(null, Validators.compose([Validators.required, Validators.max(0), Validators.min(-100)])),
      'building': new FormControl(null, Validators.compose([Validators.required])),
      'room': new FormControl(null, Validators.required)
    });
  }

  ngOnInit() {
    this.fetchSnifferDetails();
    this.fetchBuildings();
  }

  private fetchSnifferDetails() {
    this.snifferService.getSnifferById(this.route.snapshot.paramMap.get('id'))
      .subscribe(
        sniffer => {
          this.sniffer = sniffer;
          this.group.setValue({
            'mac': this.sniffer.mac,
            'name': this.sniffer.name,
            'brokerAddress': this.sniffer.configuration.brokerAddress,
            'brokerPort': this.sniffer.configuration.brokerPort,
            'lwt': this.sniffer.configuration.lwtTopic,
            'lwtm': this.sniffer.configuration.lwtMessage,
            'topic': this.sniffer.configuration.topic,
            'dump': this.sniffer.configuration.dumpMode,
            'privacy': this.sniffer.configuration.privacyMode,
            'thrashold': this.sniffer.configuration.powerThrashold,
            'building': this.sniffer.buildingId,
            'room': this.sniffer.roomId
          });
          this.otherFetchRooms(this.sniffer.buildingId);
        },
        error => {
          this.alertService.error('Impossible to fetch sniffer details!');
        }
      );
  }

  fetchBuildings() {
    this.buildingsService.getBuildings()
      .subscribe(
        data => {
          this.buildings = data;
        }, error => {
          console.error(error.name);
        }
      );
  }

  otherFetchRooms(buildingId: string) {
    this.buildingsService.getRoomsByBuildingId(buildingId)
      .subscribe(
        data => {
          this.rooms = data;
        }, error => {
          this.alertService.error('Impossible to fetch room informations!');
        }
      );
  }

  fetchRooms(e) {
    this.buildingsService.getRoomsByBuildingId(e.source.value)
      .subscribe(
        data => {
          this.rooms = data;
        }, error => {
          this.alertService.error('Impossible to fetch room informations!');
        }
      );
  }

  createSniffer() {
    if (this.group.invalid) {
      this.alertService.error('Dati inseriti non validi!');
      return;
    }
    const s: Sniffer = this.sniffer;
    s.mac = this.group.get('mac').value;
    s.name = this.group.get('name').value;
    s.buildingId = this.group.get('building').value;
    s.buildingName = this.buildings.filter(x => x.id === s.buildingId ).map(x => x.name).pop();
    s.roomId = this.group.get('room').value;
    s.roomName = this.rooms.filter(x => x.id === s.roomId ).map(x => x.name).pop();
    s.configuration = new Configuration(
      this.group.get('dump').value,
      this.group.get('privacy').value,
      this.group.get('brokerAddress').value,
      this.group.get('brokerPort').value,
      this.group.get('lwt').value,
      this.group.get('lwtm').value,
      this.group.get('topic').value,
      this.group.get('thrashold').value
    );
    this.snifferService.updateSnifferById(s).subscribe(
      data => {
        this.alertService.success('Sniffer Aggiornato!');
        this.routes.navigate(['/sniffers']);
      }, error => {
        this.alertService.error('Errore durante aggiornamento sniffer!');
      }
    );
  }

  formatLabel(value: number | null) {
    if (!value) {
      return 0;
    }
    return value;
  }

  resetValues() {
    this.group.setValue({
      'mac': this.sniffer.mac,
      'name': this.sniffer.name,
      'brokerAddress': this.sniffer.configuration.brokerAddress,
      'brokerPort': this.sniffer.configuration.brokerPort,
      'lwt': this.sniffer.configuration.lwtTopic,
      'lwtm': this.sniffer.configuration.lwtMessage,
      'topic': this.sniffer.configuration.topic,
      'dump': this.sniffer.configuration.dumpMode,
      'privacy': this.sniffer.configuration.privacyMode,
      'thrashold': this.sniffer.configuration.powerThrashold,
      'building': this.sniffer.buildingId,
      'room': this.sniffer.roomId
    });
  }
}
