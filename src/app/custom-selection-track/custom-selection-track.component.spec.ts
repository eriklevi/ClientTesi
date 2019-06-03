import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSelectionTrackComponent } from './custom-selection-track.component';

describe('CustomSelectionTrackComponent', () => {
  let component: CustomSelectionTrackComponent;
  let fixture: ComponentFixture<CustomSelectionTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomSelectionTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomSelectionTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
