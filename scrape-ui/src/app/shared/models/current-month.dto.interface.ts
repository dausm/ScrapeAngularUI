import { DailyAverage } from "./daily-average.interface";

export interface CurrentMonthDto {
  name: string,
  data: DailyAverage[]
}
