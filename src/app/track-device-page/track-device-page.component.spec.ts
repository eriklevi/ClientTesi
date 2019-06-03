import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackDevicePageComponent } from './track-device-page.component';

describe('TrackDevicePageComponent', () => {
  let component: TrackDevicePageComponent;
  let fixture: ComponentFixture<TrackDevicePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackDevicePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackDevicePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
