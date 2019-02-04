import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnifferCreatorComponent } from './sniffer-creator.component';

describe('SnifferCreatorComponent', () => {
  let component: SnifferCreatorComponent;
  let fixture: ComponentFixture<SnifferCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnifferCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnifferCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
