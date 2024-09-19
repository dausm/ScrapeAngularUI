import { DisplayValueTypes } from "../enums/display-value-type.enum";

export interface FilterOptions {
  locationName: string,
  isWeekDaysEnabled: boolean,
  weekDays?: string[],
  displayValueType: DisplayValueTypes,
  multiSelectOptions?: string[],
  multiSelectSelected?: string,
}
