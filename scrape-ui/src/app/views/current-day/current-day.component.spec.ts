import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentDayComponent } from './current-day.component';
import { CurrentDayStateService } from './current-day.state.service';
import { BaseChartOptions } from '../../shared/constants/baseChartOptions';
import { ComponentStates } from '../../shared/enums/component-states';
import { computed } from '@angular/core';

describe('CurrentDayComponent', () => {
  let component: CurrentDayComponent;
  let fixture: ComponentFixture<CurrentDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentDayComponent],
      providers: [
        // {
        //   provide: CurrentDayStateService,
        //   useValue: {
        //     chartOptions: computed(BaseChartOptions),
        //     ComponentState: ComponentStates.Ready
        //   }
        // }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
