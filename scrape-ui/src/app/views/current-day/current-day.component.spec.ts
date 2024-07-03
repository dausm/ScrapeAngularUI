import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentDayComponent } from './current-day.component';

describe('CurrentDayComponent', () => {
  let component: CurrentDayComponent;
  let fixture: ComponentFixture<CurrentDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentDayComponent]
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
