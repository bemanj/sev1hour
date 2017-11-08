import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartComponent1 } from './bar-chart.component';

describe('BarChartComponent', () => {
  let component: BarChartComponent1;
  let fixture: ComponentFixture<BarChartComponent1>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarChartComponent1 ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartComponent1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
