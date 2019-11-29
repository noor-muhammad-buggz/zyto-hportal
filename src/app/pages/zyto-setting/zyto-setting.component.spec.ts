import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZytoSettingComponent } from './zyto-setting.component';

describe('ZytoSettingComponent', () => {
  let component: ZytoSettingComponent;
  let fixture: ComponentFixture<ZytoSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZytoSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZytoSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
