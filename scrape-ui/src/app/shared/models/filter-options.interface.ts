import { DisplayValueTypes } from "../enums/display-value-type.enum";

export interface FilterOptions {
  locationName: string,
  weekDays: string[],
  displayValueType: DisplayValueTypes
}
