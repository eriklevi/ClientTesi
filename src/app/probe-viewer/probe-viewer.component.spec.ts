import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProbeViewerComponent } from './probe-viewer.component';

describe('ProbeViewerComponent', () => {
  let component: ProbeViewerComponent;
  let fixture: ComponentFixture<ProbeViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProbeViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProbeViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
