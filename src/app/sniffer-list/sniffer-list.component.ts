import { Component, OnInit } from '@angular/core';
import {SnifferService} from '../_services/sniffer.service';
import {Router} from '@angular/router';
import {Sniffer} from '../_models/sniffer';

@Component({
  selector: 'app-sniffer-list',
  templateUrl: './sniffer-list.component.html',
  styleUrls: ['./sniffer-list.component.css']
})
export class SnifferListComponent implements OnInit {

  snifferList: Sniffer[];

  constructor(
    private snifferService: SnifferService,
    private router: Router
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
}
