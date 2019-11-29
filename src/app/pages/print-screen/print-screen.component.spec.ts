import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintScreenComponent } from './print-screen.component';

describe('ActionPlanComponent', () => {
  let component: PrintScreenComponent;
  let fixture: ComponentFixture<PrintScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
