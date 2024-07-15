import { DailyAverage } from "./daily-average.interface";

export interface CurrentWeekDto {
  name: string,
  data: DailyAverage[]
}
