import { DailyAverage } from "./daily-average.interface";

export interface WeeklyDataDto {
  name: string,
  data: DailyAverage[]
}
