import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionFlowComponent } from './position-flow.component';

describe('PositionFlowComponent', () => {
  let component: PositionFlowComponent;
  let fixture: ComponentFixture<PositionFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PositionFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PositionFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
