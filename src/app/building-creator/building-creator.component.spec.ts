import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingCreatorComponent } from './building-creator.component';

describe('BuildingCreatorComponent', () => {
  let component: BuildingCreatorComponent;
  let fixture: ComponentFixture<BuildingCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildingCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
