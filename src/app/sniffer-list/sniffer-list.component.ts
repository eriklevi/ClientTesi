import { Component, OnInit } from '@angular/core';
import {SnifferService} from '../_services/sniffer.service';
import {Router} from '@angular/router';
import {Sniffer} from '../_models/sniffer';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-sniffer-list',
  templateUrl: './sniffer-list.component.html',
  styleUrls: ['./sniffer-list.component.css']
})
export class SnifferListComponent implements OnInit {

  snifferList: Sniffer[];
  searchString: string;
  errorMessage: string;

  constructor(
    private snifferService: SnifferService,
    private router: Router,
    private snackBar: MatSnackBar
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
}
