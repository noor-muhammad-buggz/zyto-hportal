import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoundationDetailComponent } from './foundation-detail.component';

describe('FoundationDetailComponent', () => {
  let component: FoundationDetailComponent;
  let fixture: ComponentFixture<FoundationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoundationDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoundationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
