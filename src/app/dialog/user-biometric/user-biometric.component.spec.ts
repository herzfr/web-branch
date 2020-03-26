import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBiometricComponent } from './user-biometric.component';

describe('UserBiometricComponent', () => {
  let component: UserBiometricComponent;
  let fixture: ComponentFixture<UserBiometricComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserBiometricComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBiometricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
