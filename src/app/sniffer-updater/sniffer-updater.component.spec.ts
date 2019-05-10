import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnifferUpdaterComponent } from './sniffer-updater.component';

describe('SnifferUpdaterComponent', () => {
  let component: SnifferUpdaterComponent;
  let fixture: ComponentFixture<SnifferUpdaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnifferUpdaterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnifferUpdaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
