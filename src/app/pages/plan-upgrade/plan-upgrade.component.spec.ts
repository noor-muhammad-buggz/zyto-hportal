import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanUpgradeComponent } from './plan-upgrade.component';

describe('PlanUpgradeComponent', () => {
  let component: PlanUpgradeComponent;
  let fixture: ComponentFixture<PlanUpgradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanUpgradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanUpgradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
