import { Component, OnInit } from '@angular/core';
import {SnifferService} from '../_services/sniffer.service';
import {Router} from '@angular/router';
import {Sniffer} from '../_models/sniffer';
import {MatSnackBar} from '@angular/material';
import {AlertService} from '../_services/alert.service';

@Component({
  selector: 'app-sniffer-list',
  templateUrl: './sniffer-list.component.html',
  styleUrls: ['./sniffer-list.component.css']
})
export class SnifferListComponent implements OnInit {

  snifferList: Sniffer[];
  searchString: string;
  errorMessage: string;
  connectedClients: string[];
  displayedColumns: string[] = ['name', 'mac', 'buildingName', 'roomName', 'details', 'update', 'delete' ];


  constructor(
    private snifferService: SnifferService,
    private router: Router,
    private snackBar: MatSnackBar,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.fetchSniffers();
  }

  private fetchSniffers() {
    this.snifferService
      .getSniffers()
      .subscribe(
        sniffers => {
          this.snifferList = sniffers;
          this.fetchConnectedClients();
        }, error => {
          console.error(error.name);
        }
      );
  }

  deleteSniffer(id: string) {
    this.snifferService.deleteSnifferById(id)
      .subscribe(
        data => {
          const index: number = this.snifferList.findIndex( sniffer => sniffer.id === id);
          this.snifferList.splice(index, 1);
        }, error => {
          console.error(error.name);
        }
      );
  }

  searchByMac() {
    let result: Sniffer[] = null;
    if (this.searchString.match('^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$')) {
      let proxy = this.searchString;
      proxy = proxy.toLowerCase(); // mac address are stored lowercase in db
      result = this.snifferList.filter( x => x.mac === proxy);
      if (result.length === 0) {
        this.errorMessage = 'No results!';
        this.showOkSnackBar(this.errorMessage);
      } else {
        this.snifferList = result;
      }
    } else {
      this.errorMessage = 'This is not a mac address!';
      this.showOkSnackBar(this.errorMessage);
    }
  }

  searchByName() {

  }

  searchByBuilding() {

  }

  searchByRoom() {

  }

  showOkSnackBar(message: string) {
    this.snackBar.open(message,  'Ok', {duration: 5000, horizontalPosition: 'right', verticalPosition: 'top'});
  }

  private fetchConnectedClients() {
    this.snifferService
      .getConnectedSniffers()
      .subscribe( data => {
        this.connectedClients = data;
        this.snifferList.forEach(sniffer => {
          if (this.connectedClients.includes(sniffer.macID)) {
              sniffer.status = 'Connected';
          } else {
            sniffer.status = 'Disconnected';
          }
        });
      }, error => {
        this.alertService.error('Unable to fetch connected clients!');
      });

  }
}
