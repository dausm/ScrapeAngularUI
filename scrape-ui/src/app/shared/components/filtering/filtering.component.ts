import { Component, computed, input, InputSignal, output } from '@angular/core';
import { GymLocations } from '../../enums/gym-locations';
import { WeekDays } from '../../enums/week-days.map';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FilterOptions } from '../../models/filter-options.interface';
import { enumKeys } from '../../utility/utilities';
import { DisplayValueTypes } from '../../enums/display-value-type.enum';
import { DefaultFilterOptions } from '../../constants/default-filter-options';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-filtering',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatCheckboxModule,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', floatLabel: 'auto' },
    },
  ],
  template: `
    <div class="flex items-start gap-2 my-3">
      @if(filterOptions$$() !== undefined){
      <div class="flex-initial py-2">
        <mat-form-field [floatLabel]="'auto'">
          <mat-label>Location</mat-label>
          <mat-select
            required
            [formControl]="filterLocation"
            (selectionChange)="filterLocationChange()"
          >
            @for(location of GymLocations.keys(); track $index){
            <mat-option [value]="GymLocations.get(location)">
              {{ GymLocations.get(location) }}
            </mat-option>
            }
          </mat-select>
        </mat-form-field>
      </div>

      <div class="flex-auto py-2">
        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title>Filters</mat-panel-title>
          </mat-expansion-panel-header>

          <div class="flex flex-wrap gap-8 pt-4">

           <mat-form-field>
              <mat-label>Display Data By</mat-label>
              <mat-select
                [formControl]="filterDisplayValueType"
                (selectionChange)="filterDisplayTypeChange()"
              >
                @for(display of enumKeys(DisplayValueTypes); track $index){
                <mat-option [value]="DisplayValueTypes[display]">
                  {{ DisplayValueTypes[display] }}
                </mat-option>
                }
              </mat-select>
            </mat-form-field>

            @if(filterOptions$$()!.multiSelectOptions){
            <div>
              <mat-form-field>
                <mat-label>Select Weeks</mat-label>
                <mat-select
                  [formControl]="multiSelect"
                  multiple
                  (selectionChange)="filterSelectedOptions()"
                >
                  <mat-select-trigger>
                    {{multiSelect.value?.[0] || ''}}
                    @if ((multiSelect.value?.length || 0) > 1) {
                    <span class="example-additional-selection">
                      (+{{ (multiSelect.value?.length || 0) - 1 }}
                      {{ multiSelect.value?.length === 2 ? 'other' : 'others' }})
                    </span>
                    }
                  </mat-select-trigger>
                  @for (topping of filterSelectionList; track topping) {
                  <mat-option [value]="topping">{{ topping }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
            </div>
            }

            @if(filterOptions$$()!.isWeekDaysEnabled){
            <div class="flex flex-wrap gap-2 items-center">
              <fieldset
                class="contents py-2 my-2"
                [formGroup]="filterByDayFormGroup"
              >
                <legend class="inline-block">Day of Week:</legend>
                @for(day of WeekDays.keys(); track $index){
                <mat-checkbox
                  [id]="day"
                  name="weekDay"
                  [formControlName]="WeekDays.get(day)!"
                  (change)="filterWeekDaysChange()"
                >
                  {{ WeekDays.get(day)! }}
                </mat-checkbox>
                }
              </fieldset>
            </div>
            }

            <div class="flex-1 flex justify-end items-end">
              <button
                (click)="resetToDefault()"
                class="rounded underline underline-offset-4 p-4 hover:no-underline"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </mat-expansion-panel>
      </div>
      }
    </div>
  `,
})
export class FilteringComponent {
  enumKeys = enumKeys;
  GymLocations: typeof GymLocations = GymLocations;
  WeekDays: typeof WeekDays = WeekDays;
  DisplayValueTypes: typeof DisplayValueTypes = DisplayValueTypes;

  filterSelectionList: string[] = [];
  filterDisplayValueType = new FormControl<DisplayValueTypes>(
    DisplayValueTypes.Average
  );
  filterLocation = new FormControl('');
  multiSelect = new FormControl('');

  filterOptionsChange = output<FilterOptions>();
  filterOptions: InputSignal<FilterOptions> =
    input.required<FilterOptions>();
  filterOptions$$ = computed(() => {
    const updatedOptions = this.filterOptions();
    if (updatedOptions) {
      this.filterDisplayValueType.setValue(updatedOptions.displayValueType);
      this.filterLocation.setValue(updatedOptions.locationName);
      this.multiSelect.setValue(updatedOptions.multiSelectSelected ?? '');
      this.filterSelectionList = updatedOptions.multiSelectOptions ?? [];
      if (updatedOptions.weekDays) {
        Object.keys(this.filterByDayFormGroup.controls).forEach((key) => {
          this.filterByDayFormGroup
            .get(key)
            ?.setValue(updatedOptions.weekDays!.indexOf(key) > -1);
        });
      }
    }

    return updatedOptions;
  });

  filterByDayFormGroup = new FormGroup({
    Sunday: new FormControl(true),
    Monday: new FormControl(true),
    Tuesday: new FormControl(true),
    Wednesday: new FormControl(true),
    Thursday: new FormControl(true),
    Friday: new FormControl(true),
    Saturday: new FormControl(true),
  });

  getActiveWeekDays(): string[] {
    let days: string[] = [];

    Object.keys(this.filterByDayFormGroup.controls).forEach((key) => {
      if (this.filterByDayFormGroup.get(key)?.value) {
        days.push(key);
      }
    });

    return days;
  }

  filterLocationChange(): void {
    const newLocation = this.filterLocation.value ?? '';
    this.filterOptionsChange.emit({
      ...this.filterOptions$$()!,
      locationName: newLocation,
    });
  }

  filterWeekDaysChange(): void {
    const options: FilterOptions = this.filterOptions$$()!;
    const newWeekDays = this.getActiveWeekDays();

    this.filterOptionsChange.emit({ ...options, weekDays: newWeekDays });
  }

  filterDisplayTypeChange(): void {
    this.filterOptionsChange.emit({
      ...this.filterOptions$$()!,
      displayValueType: this.filterDisplayValueType.value!,
    });
  }

  filterSelectedOptions(): void {
    this.filterOptionsChange.emit({
      ...this.filterOptions$$()!,
      multiSelectSelected: this.multiSelect.value!,
    });
  }

  resetToDefault(): void {
    this.filterOptionsChange.emit({
      displayValueType: DefaultFilterOptions.displayValueType,
      locationName: this.filterOptions().locationName,
      multiSelectSelected: '',
      isWeekDaysEnabled: this.filterOptions().isWeekDaysEnabled,
      multiSelectOptions: this.filterOptions().multiSelectOptions,
      weekDays: this.filterOptions().isWeekDaysEnabled ? DefaultFilterOptions.weekDays : undefined
    });
  }
}
