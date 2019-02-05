import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Building} from '../_models/building';
import {BuildingService} from '../_services/building.service';

@Component({
  selector: 'app-building-creator',
  templateUrl: './building-creator.component.html',
  styleUrls: ['./building-creator.component.css']
})
export class BuildingCreatorComponent implements OnInit {
  public group: FormGroup;
  public buildings: Building[];

  constructor(
    private buildingsService: BuildingService,
  ) {
    this.group = new FormGroup({
      'name': new FormControl('', Validators.compose([Validators.required]))
    });
  }

  ngOnInit(): void {
  }

  createBuilding() {
    if (this.group.invalid) {
      return;
    }
    const b: Building = new Building();
    b.name = this.group.get('name').value;
    this.buildingsService.addBuilding(b)
      .subscribe(
        data => {
          console.log('Aggiunto building');
        }, error => {
          console.error(error.name);
        }
      );
  }
}
