import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnifferDetailComponent } from './sniffer-detail.component';

describe('SnifferDetailComponent', () => {
  let component: SnifferDetailComponent;
  let fixture: ComponentFixture<SnifferDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnifferDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnifferDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
