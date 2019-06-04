import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowMapComponent } from './flow-map.component';

describe('FlowMapComponent', () => {
  let component: FlowMapComponent;
  let fixture: ComponentFixture<FlowMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
