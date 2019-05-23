import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSelectionPageComponent } from './custom-selection-page.component';

describe('CustomSelectionPageComponent', () => {
  let component: CustomSelectionPageComponent;
  let fixture: ComponentFixture<CustomSelectionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomSelectionPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomSelectionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
