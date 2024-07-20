import { Component, computed, input, InputSignal, output } from '@angular/core';
import { GymLocations } from '../../enums/gym-locations';
import { WeekDays } from '../../enums/week-days.map';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtering',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <label>
      <span class="pr-2">Select a gym location:</span>
      <select
        class="rounded-full text-black my-2"
        (change)="locationChange.emit(getElementValue($event))"
      >
        @for(location of GymLocations.keys(); track $index){
        <option
          [attr.selected]="localLocation() === GymLocations.get(location)
            ? ''
            : null"
          [attr.value]="GymLocations.get(location)"
        >
          {{ GymLocations.get(location) }}
        </option>
        }
      </select>
    </label>

    <fieldset class="inline-flex py-2 my-2" [formGroup]="filterByDayFormGroup">
      <legend>Filter by week day:</legend>
      @for(day of WeekDays.keys(); track $index){
      <label [for]="day" class="inline-flex items-center mx-3">
        <input type="checkbox" [id]="day" name="weekDay" [formControlName]="WeekDays.get(day)!" (change)="weekDayChange.emit(getActiveWeekDays())"/>
        <span class="ml-2">{{ WeekDays.get(day)! }}</span>
      </label>
      }
    </fieldset>
  `,
})
export class FilteringComponent {

  getElementValue($event: Event): string {
    return ($event.target as HTMLSelectElement).value ?? '';
  }

  location: InputSignal<string | undefined> = input<string>();
  localLocation = computed(() => this.location());
  locationChange = output<string>();
  weekDayChange = output<string[]>();

  GymLocations: typeof GymLocations = GymLocations;
  WeekDays: typeof WeekDays = WeekDays;

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
}
