import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackDeviceChartComponent } from './track-device-chart.component';

describe('TrackDeviceChartComponent', () => {
  let component: TrackDeviceChartComponent;
  let fixture: ComponentFixture<TrackDeviceChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackDeviceChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackDeviceChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
