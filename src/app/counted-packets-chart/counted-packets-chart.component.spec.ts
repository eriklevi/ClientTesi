import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountedPacketsChartComponent } from './counted-packets-chart.component';

describe('CountedPacketsChartComponent', () => {
  let component: CountedPacketsChartComponent;
  let fixture: ComponentFixture<CountedPacketsChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountedPacketsChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountedPacketsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
