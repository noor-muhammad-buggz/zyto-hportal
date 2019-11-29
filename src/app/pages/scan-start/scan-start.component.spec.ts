import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanStartComponent } from './scan-start.component';

describe('ScanStartComponent', () => {
  let component: ScanStartComponent;
  let fixture: ComponentFixture<ScanStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
