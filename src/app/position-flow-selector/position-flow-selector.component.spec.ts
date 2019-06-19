import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionFlowSelectorComponent } from './position-flow-selector.component';

describe('PositionFlowSelectorComponent', () => {
  let component: PositionFlowSelectorComponent;
  let fixture: ComponentFixture<PositionFlowSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PositionFlowSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionFlowSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
