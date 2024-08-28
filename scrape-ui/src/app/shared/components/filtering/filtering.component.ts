import { Component, computed, input, InputSignal, output } from '@angular/core';
import { GymLocations } from '../../enums/gym-locations';
import { WeekDays } from '../../enums/week-days.map';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FilterOptions } from '../../models/filter-options.interface';
import { getSelectElementValue, enumKeys } from '../../utility/utilities';
import { DisplayValueTypes } from '../../enums/display-value-type.enum';
import { DefaultFilterOptions } from '../../constants/default-filter-options';

@Component({
  selector: 'app-filtering',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
  @if(filterOptions$$() !== undefined){
    <label>
      <span class="pr-2">Select a gym location:</span>
      <select
        [formControl]="filterLocation"
        class="rounded-full text-black my-2"
        (change)="filterLocationChange($event)"
      >
        @if(filterOptions$$()!.locationName === ''){
          <option selected></option>
        }
        @for(location of GymLocations.keys(); track $index){
        <option
          [attr.selected]="filterOptions$$()!.locationName === GymLocations.get(location)
            ? ''
            : null"
          [attr.value]="GymLocations.get(location)"
        >
          {{ GymLocations.get(location) }}
        </option>
        }
      </select>
    </label>

    @if(filterOptions$$()!.weekDays){
    <fieldset class="inline-flex py-2 my-2" [formGroup]="filterByDayFormGroup">
      <legend>Filter by week day:</legend>
      @for(day of WeekDays.keys(); track $index){
      <label [for]="day" class="inline-flex items-center mx-3">
        <input type="checkbox" [id]="day" name="weekDay" [formControlName]="WeekDays.get(day)!" (change)="filterWeekDaysChange()"/>
        <span class="ml-2">{{ WeekDays.get(day)! }}</span>
      </label>
      }
    </fieldset>
    }

    <label>
      <span>Display Data By:</span>
      <select
        [formControl]="filterDisplayValueType"
        class="rounded-full text-black my-2"
        (change)="filterDisplayTypeChange()"
      >
      @for(display of enumKeys(DisplayValueTypes); track $index){
        <option
          [attr.selected]="filterOptions$$()!.displayValueType === DisplayValueTypes[display]
            ? ''
            : null"
          [attr.value]="DisplayValueTypes[display]"
        >
          {{ DisplayValueTypes[display] }}
        </option>
      }
      </select>
    </label>

    <button (click)="resetToDefault()">Reset</button>
  }
  `,
})
export class FilteringComponent {
  enumKeys = enumKeys;
  GymLocations: typeof GymLocations = GymLocations;
  WeekDays: typeof WeekDays = WeekDays;
  DisplayValueTypes: typeof DisplayValueTypes = DisplayValueTypes;

  filterDisplayValueType = new FormControl<DisplayValueTypes>(DisplayValueTypes.Average);
  filterLocation = new FormControl('');

  filterOptionsChange = output<FilterOptions>();
  filterOptions: InputSignal<FilterOptions | undefined> = input<FilterOptions>();
  filterOptions$$ = computed(() => {
    const updatedOptions = this.filterOptions();
    if(updatedOptions){
      this.filterDisplayValueType.setValue(updatedOptions.displayValueType);
      this.filterLocation.setValue(updatedOptions.locationName);
      if(updatedOptions.weekDays){
        Object.keys(this.filterByDayFormGroup.controls).forEach(key => {
          this.filterByDayFormGroup
            .get(key)
            ?.setValue(updatedOptions.weekDays!.indexOf(key) > -1);
        })
      }
    }

    return updatedOptions
    }
  );

  filterByDayFormGroup = new FormGroup({
    Sunday: new FormControl(true),
    Monday: new FormControl(true),
    Tuesday: new FormControl(true),
    Wednesday: new FormControl(true),
    Thursday: new FormControl(true),
    Friday: new FormControl(true),
    Saturday: new FormControl(true),
  })


 getActiveWeekDays(): string[] {
   let days: string[] = [];

   Object.keys(this.filterByDayFormGroup.controls).forEach(key => {
     if(this.filterByDayFormGroup.get(key)?.value){
       days.push(key);
      }
    });

    return days;
  }

  filterLocationChange($event: Event) {
    const options: FilterOptions = this.filterOptions$$()!;
    const newLocation = getSelectElementValue($event)

    this.filterOptionsChange.emit({...options, locationName: newLocation});
  }

  filterWeekDaysChange(){
    const options: FilterOptions = this.filterOptions$$()!;
    const newWeekDays = this.getActiveWeekDays();

    this.filterOptionsChange.emit({...options, weekDays: newWeekDays});
  }

  filterDisplayTypeChange() {
    const options: FilterOptions = this.filterOptions$$()!;
    const newDisplayType = this.filterDisplayValueType.value!;

    this.filterOptionsChange.emit({...options, displayValueType: newDisplayType});
  }

  resetToDefault() {
    this.filterOptionsChange.emit(DefaultFilterOptions);
   }
}
