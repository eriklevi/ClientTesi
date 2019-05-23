import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMultipleSelectionComponent } from './custom-multiple-selection.component';

describe('CustomMultipleSelectionComponent', () => {
  let component: CustomMultipleSelectionComponent;
  let fixture: ComponentFixture<CustomMultipleSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomMultipleSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomMultipleSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
