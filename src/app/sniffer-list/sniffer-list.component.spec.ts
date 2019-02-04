import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnifferListComponent } from './sniffer-list.component';

describe('SnifferListComponent', () => {
  let component: SnifferListComponent;
  let fixture: ComponentFixture<SnifferListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnifferListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnifferListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
