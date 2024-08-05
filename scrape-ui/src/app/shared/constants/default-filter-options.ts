import { DisplayValueTypes } from "../enums/display-value-type.enum";
import { WeekDays } from "../enums/week-days.map";
import { FilterOptions } from "../models/filter-options.interface";

export const DefaultFilterOptions: FilterOptions = {
  locationName: '',
  weekDays: Array.from(WeekDays.values()),
  displayValueType: DisplayValueTypes.Average
}
