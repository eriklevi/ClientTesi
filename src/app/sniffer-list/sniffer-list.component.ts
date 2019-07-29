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

  snifferList: Sniffer[]; // the sniffers displayed
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
          this.snifferList = sniffers;
          this.snifferList = this.snifferList.concat(this.snifferList);
          this.snifferList = this.snifferList.concat(this.snifferList);
          this.snifferList = this.snifferList.concat(this.snifferList);
          this.fetchConnectedClients();
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
          const index: number = this.snifferList.findIndex( sniffer => sniffer.id === id);
          this.snifferList.splice(index, 1);
        }, error => {
          console.error(error.name);
        }
      );
  }

  searchByMac() {
    this.requestStart = true;
    let result: Sniffer[] = null;
    if (this.searchString.match('^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$')) {
      let proxy = this.searchString;
      proxy = proxy.toLowerCase(); // mac address are stored lowercase in db
      result = this.snifferList.filter( x => x.mac === proxy);
      if (result.length === 0) {
        this.errorMessage = 'No results!';
        this.showOkSnackBar(this.errorMessage);
        this.requestStart = false;
      } else {
        this.snifferList = result;
        this.requestStart = false;
      }
    } else {
      this.errorMessage = 'This is not a mac address!';
      this.showOkSnackBar(this.errorMessage);
      this.requestStart = false;
    }
  }

  searchByName() {
    this.requestStart = true;
    let result: Sniffer[] = null;
    result = this.snifferList.filter(x => x.name === this.searchString);
    if (result.length > 0) {
      this.snifferList = result;
      this.requestStart = false;
    } else {
      this.errorMessage = 'No results!';
      this.showOkSnackBar(this.errorMessage);
      this.requestStart = false;
    }
  }

  searchByBuilding() {
    this.requestStart = true;
    let result: Sniffer[] = null;
    result = this.snifferList.filter(x => x.buildingName === this.searchString);
    if (result.length > 0) {
      this.snifferList = result;
      this.requestStart = false;
    } else {
      this.errorMessage = 'No results!';
      this.showOkSnackBar(this.errorMessage);
      this.requestStart = false;
    }
  }

  searchByRoom() {
    this.requestStart = false;
    let result: Sniffer[] = null;
    result = this.snifferList.filter(x => x.roomName === this.searchString);
    if (result.length > 0) {
      this.snifferList = result;
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
        this.snifferList.forEach(sniffer => {
          if (this.connectedClients.includes(sniffer.macID) && sniffer.status == null) {
              sniffer.status = 'Connected';
          } else {
            sniffer.status = 'Disconnected';
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
          this.snifferList.find(s => s.macID === macID).status = 'resetting';
          this.requestStart = false;
        },
        error1 => {
          this.alertService.error('An error occurred during reset!\n' + error1.error);
          this.requestStart = false;
        }
      );
  }

  reloadSniffers() {
    this.snifferList = this.fetchedSniffersList;
  }
}
