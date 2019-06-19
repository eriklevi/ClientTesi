import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionFlowByMacComponent } from './position-flow-by-mac.component';

describe('PositionFlowByMacComponent', () => {
  let component: PositionFlowByMacComponent;
  let fixture: ComponentFixture<PositionFlowByMacComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PositionFlowByMacComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionFlowByMacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
