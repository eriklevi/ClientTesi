import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-selection-page',
  templateUrl: './custom-selection-page.component.html',
  styleUrls: ['./custom-selection-page.component.css']
})
export class CustomSelectionPageComponent implements OnInit {


  private showCustomSelection = false;
  chartWidth = 100;
  constructor() { }

  ngOnInit() {
  }
  toggleCustomSelection() {
    this.showCustomSelection = !this.showCustomSelection;
    this.showCustomSelection ? this.chartWidth = 80 : this.chartWidth = 100;
  }

}
