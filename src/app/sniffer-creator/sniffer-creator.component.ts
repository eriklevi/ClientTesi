import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Sniffer} from '../_models/sniffer';
import {SnifferService} from '../_services/sniffer.service';
import {BuildingService} from '../_services/building.service';
import {Building} from '../_models/building';
import {Room} from '../_models/room';
import {RoomService} from '../_services/room.service';
import {AlertService} from '../_services/alert.service';
import {Configuration} from '../_models/configuration';
import {routing} from '../app.routing';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sniffer-creator',
  templateUrl: './sniffer-creator.component.html',
  styleUrls: ['./sniffer-creator.component.css']
})
export class SnifferCreatorComponent implements OnInit {

  public group: FormGroup;
  public buildings: Building[];
  public rooms: Room[];

  constructor(
      private snifferService: SnifferService,
      private buildingsService: BuildingService,
      private roomService: RoomService,
      private alertService: AlertService,
      private router: Router
  ) {
    this.group = new FormGroup({
      'mac': new FormControl('', Validators.compose([Validators.required, Validators.pattern('^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$')])),
      'name': new FormControl('', Validators.compose([Validators.required])),
      'brokerAddress': new FormControl('', Validators.compose([Validators.required, Validators.pattern('^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$')])),
      'brokerPort': new FormControl(1883, Validators.compose([Validators.required, Validators.max(65535), Validators.min(1)])),
      'lwt': new FormControl('lwt_topic', Validators.required),
      'lwtm': new FormControl('Disconnected', Validators.required),
      'topic': new FormControl('', Validators.required),
      'dump': new FormControl(false),
      'privacy': new FormControl(false),
      'thrashold': new FormControl(-100),
      'building': new FormControl('', Validators.compose([Validators.required])),
      'room': new FormControl(' ', Validators.required)
    });
  }

  ngOnInit() {
    this.fetchBuildings();
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

  fetchRooms(e) {
    this.buildingsService.getRoomsByBuildingId(e.source.value)
      .subscribe(
        data => {
          this.rooms = data;
        }, error => {
          console.error(error);
        }
      );
  }

  createSniffer() {
    if (this.group.invalid) {
      this.alertService.error('Dati inseriti non validi!');
    return;
    }
    const s: Sniffer = new Sniffer();
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
    this.snifferService.createSniffer(s).subscribe(
      data => {
        this.alertService.success('Aggiunto nuovo sniffer!');
        this.router.navigate(['/sniffers']);
      }, error => {
        this.alertService.error('Errore durante aggiunta nuovo sniffer!');
      }
    );
  }

  formatLabel(value: number | null) {
    if (!value) {
      return 0;
    }
    return value;
  }
}
