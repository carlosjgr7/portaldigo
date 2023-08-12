import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitelComponent } from './digitel.component';

describe('DigitelComponent', () => {
  let component: DigitelComponent;
  let fixture: ComponentFixture<DigitelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
