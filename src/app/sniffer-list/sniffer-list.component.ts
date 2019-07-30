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

  displayedSniffers: Sniffer[]; // the sniffers displayed
  fetchedSniffersList: Sniffer[]; // the sniffers fetched, to avoid multiple useless calls
  searchString: string;
  errorMessage: string;
  connectedClients: string[];
  displayedColumns: string[] = ['name', 'mac', 'buildingName', 'roomName', 'status', 'details', 'update', 'delete', 'reset'];
  requestStart = false;


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
    this.requestStart = true;
    this.snifferService
      .getSniffers()
      .subscribe(
        sniffers => {
          this.fetchedSniffersList = sniffers;
          this.fetchConnectedClients();
          this.displayedSniffers = this.fetchedSniffersList;
          this.requestStart = false;
        }, error => {
          console.error(error.name);
          this.requestStart = false;
        }
      );
  }

  deleteSniffer(id: string) {
    this.snifferService.deleteSnifferById(id)
      .subscribe(
        data => {
          const index: number = this.displayedSniffers.findIndex( sniffer => sniffer.id === id);
          this.displayedSniffers.splice(index, 1);
        }, error => {
          console.error(error.name);
        }
      );
  }

  searchByMac() {
    if (this.searchString === undefined) {
      return;
    }
    this.requestStart = true;
    let result: Sniffer[] = null;
    if (this.searchString.match('^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$')) {
      let proxy = this.searchString;
      proxy = proxy.toLowerCase(); // mac address are stored lowercase in db
      result = this.displayedSniffers.filter( x => x.mac === proxy);
      if (result.length === 0) {
        this.errorMessage = 'No results!';
        this.showOkSnackBar(this.errorMessage);
        this.requestStart = false;
      } else {
        this.displayedSniffers = result;
        this.requestStart = false;
      }
    } else {
      this.errorMessage = 'This is not a mac address!';
      this.showOkSnackBar(this.errorMessage);
      this.requestStart = false;
    }
  }

  searchByName() {
    if (this.searchString === undefined) {
      return;
    }
    this.requestStart = true;
    let result: Sniffer[] = null;
    result = this.displayedSniffers.filter(x => x.name === this.searchString);
    if (result.length > 0) {
      this.displayedSniffers = result;
      this.requestStart = false;
    } else {
      this.errorMessage = 'No results!';
      this.showOkSnackBar(this.errorMessage);
      this.requestStart = false;
    }
  }

  searchByBuilding() {
    if (this.searchString === undefined) {
      return;
    }
    this.requestStart = true;
    let result: Sniffer[] = null;
    result = this.displayedSniffers.filter(x => x.buildingName === this.searchString);
    if (result.length > 0) {
      this.displayedSniffers = result;
      this.requestStart = false;
    } else {
      this.errorMessage = 'No results!';
      this.showOkSnackBar(this.errorMessage);
      this.requestStart = false;
    }
  }

  searchByRoom() {
    if (this.searchString === undefined) {
      return;
    }
    this.requestStart = false;
    let result: Sniffer[] = null;
    result = this.displayedSniffers.filter(x => x.roomName === this.searchString);
    if (result.length > 0) {
      this.displayedSniffers = result;
      this.requestStart = false;
    } else {
      this.errorMessage = 'No results!';
      this.showOkSnackBar(this.errorMessage);
      this.requestStart = false;
    }
  }

  showOkSnackBar(message: string) {
    this.snackBar.open(message,  'Ok', {duration: 5000, horizontalPosition: 'center', verticalPosition: 'bottom'});
  }

  private fetchConnectedClients() {
    this.snifferService
      .getConnectedSniffers()
      .subscribe( data => {
        this.connectedClients = data;
        this.fetchedSniffersList.forEach(sniffer => {
          if (sniffer.status == null) {
            if (this.connectedClients.includes(sniffer.macID)) {
              sniffer.status = 'Connected';
            } else {
              sniffer.status = 'Disconnected';
            }
          }
        });
      }, error => {
        this.alertService.error('Unable to fetch connected clients!');
      });

  }

  private resetSnifferById(macID: string) {
    this.requestStart = true;
    this.snifferService.resetSniffersById(macID)
      .subscribe(
        next => {
          this.alertService.success('Sniffer is resetting');
          this.displayedSniffers.find(s => s.macID === macID).status = 'resetting';
          this.requestStart = false;
        },
        error1 => {
          this.alertService.error('An error occurred during reset!\n' + error1.error);
          this.requestStart = false;
        }
      );
  }

  reloadSniffers() {
    this.displayedSniffers = this.fetchedSniffersList;
  }
}
