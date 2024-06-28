import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyAveragesComponent } from './weekly-averages.component';

describe('WeeklyAveragesComponent', () => {
  let component: WeeklyAveragesComponent;
  let fixture: ComponentFixture<WeeklyAveragesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyAveragesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeeklyAveragesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
