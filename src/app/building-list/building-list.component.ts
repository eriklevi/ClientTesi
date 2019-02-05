import { Component, OnInit } from '@angular/core';
import {Building} from '../_models/building';
import {BuildingService} from '../_services/building.service';

@Component({
  selector: 'app-building-list',
  templateUrl: './building-list.component.html',
  styleUrls: ['./building-list.component.css']
})
export class BuildingListComponent implements OnInit {

  buildingList: Building[];

  constructor(
    private buildingService: BuildingService
  ) { }

  ngOnInit() {
    this.fetchBuildings();
  }

  fetchBuildings() {
    this.buildingService
      .getBuildings()
      .subscribe(
        data => {
          this.buildingList = data;
        }, error => {
          console.error(error.name);
        }
      );
  }
}
