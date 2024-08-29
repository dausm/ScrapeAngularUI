import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { FilteringComponent } from './filtering.component';
import { DefaultFilterOptions } from '../../constants/default-filter-options';
import { By } from '@angular/platform-browser';
import { DisplayValueTypes } from '../../enums/display-value-type.enum';
import { DebugElement } from '@angular/core';
import { GymLocations } from '../../enums/gym-locations';

describe('FilteringComponent', () => {
  let component: FilteringComponent;
  let fixture: ComponentFixture<FilteringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilteringComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display weekday checkboxes if weekdays are passed', () => {
    fixture.componentRef.setInput('filterOptions', DefaultFilterOptions);
    fixture.detectChanges();

    const fieldset = fixture.debugElement.query(By.css('fieldset'));

    expect(fieldset).toBeTruthy();
  })

  it('should NOT display weekday checkboxes if weekdays NOT passed', () => {
    fixture.componentRef.setInput('filterOptions', DefaultFilterOptions);
    fixture.detectChanges();

    const fieldset = fixture.debugElement.query(By.css('fieldset'));

    expect(component).toBeTruthy();
    expect(fieldset).toBeTruthy();

    fixture.componentRef.setInput('filterOptions', {
      locationName: '',
      displayValueType: DisplayValueTypes.Average
    });
    fixture.detectChanges();

    const fieldset2 = fixture.debugElement.query(By.css('fieldset'));

    expect(fieldset2).toBeFalsy();
  })

  it('should emit an update FilterOptions when Weekdays change', fakeAsync(() => {
    const handleSpy = spyOn(component, 'filterWeekDaysChange').and.callThrough();
    fixture.componentRef.setInput('filterOptions', DefaultFilterOptions);
    fixture.detectChanges();

    const fieldset: HTMLInputElement = fixture.nativeElement.querySelector('input[type="checkbox"]');
    fieldset.click();
    tick();
    fixture.detectChanges();

    expect(handleSpy).toHaveBeenCalled();
  }))

  it('should emit an update FilterOptions when location changes', fakeAsync(() => {
    const handleSpy = spyOn(component, 'filterLocationChange').and.callThrough();
    fixture.componentRef.setInput('filterOptions', DefaultFilterOptions);
    fixture.detectChanges();

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    select.value = select.options[1].value;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(handleSpy).toHaveBeenCalled();
  }))
});
