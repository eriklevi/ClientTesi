import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceEstimationCardComponent } from './device-estimation-card.component';

describe('DeviceEstimationCardComponent', () => {
  let component: DeviceEstimationCardComponent;
  let fixture: ComponentFixture<DeviceEstimationCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceEstimationCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceEstimationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
