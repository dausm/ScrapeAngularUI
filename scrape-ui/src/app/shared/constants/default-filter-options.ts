import { DisplayValueTypes } from "../enums/display-value-type";
import { WeekDays } from "../maps/week-days.map";
import { FilterOptions } from "../models/filter-options.interface";

export const DefaultFilterOptions: FilterOptions = {
  locationName: '',
  isWeekDaysEnabled: false,
  weekDays: Array.from(WeekDays.values()),
  displayValueType: DisplayValueTypes.average
}
