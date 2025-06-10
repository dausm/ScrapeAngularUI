import { DisplayValueTypes } from "../enums/display-value-type";

export interface FilterOptions {
  locationName: string,
  isWeekDaysEnabled: boolean,
  weekDays?: string[],
  displayValueType: DisplayValueTypes,
  multiSelectOptions?: string[],
  multiSelectSelected?: string,
}
