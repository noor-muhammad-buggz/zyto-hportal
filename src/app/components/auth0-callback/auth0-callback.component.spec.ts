import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Auth0CallbackComponent } from './auth0-callback.component';

describe('Auth0CallbackComponent', () => {
  let component: Auth0CallbackComponent;
  let fixture: ComponentFixture<Auth0CallbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Auth0CallbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Auth0CallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
