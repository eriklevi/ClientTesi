import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUpdaterComponent } from './user-updater.component';

describe('UserUpdaterComponent', () => {
  let component: UserUpdaterComponent;
  let fixture: ComponentFixture<UserUpdaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserUpdaterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserUpdaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
