import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../_services/user.service';
import {User} from '../_models/user';
import {validate} from 'codelyzer/walkerFactory/walkerFn';
import {Sniffer} from '../_models/sniffer';
import {SnifferService} from '../_services/sniffer.service';

@Component({
  selector: 'app-sniffer-creator',
  templateUrl: './sniffer-creator.component.html',
  styleUrls: ['./sniffer-creator.component.css']
})
export class SnifferCreatorComponent implements OnInit {

  public group: FormGroup;

  constructor(
      private snifferService: SnifferService
  ) {
    this.group = new FormGroup({
      'mac': new FormControl('', Validators.compose([Validators.required, Validators.pattern('^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$')])),
      'name': new FormControl('', Validators.compose([Validators.required])),
      'building': new FormControl('', Validators.compose([Validators.required])),
      'room': new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
  }

  createSniffer() {
    if (this.group.invalid) {
    return;
    }
    const s: Sniffer = new Sniffer();
    s.mac = this.group.get('mac').value;
    s.name = this.group.get('name').value;
    s.building = this.group.get('building').value;
    s.room = this.group.get('room').value;
    this.snifferService.createSniffer(s).subscribe(
      data => {
        console.log('Nuovo sniffer creato');
      }, error => {
        console.log(error.name);
      }
    );
  }
}
