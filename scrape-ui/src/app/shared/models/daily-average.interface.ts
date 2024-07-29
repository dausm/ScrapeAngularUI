export interface DailyAverage {
  id: number,
  name: string,
  dateCalculated: string,
  dayOfWeek: string,
  maxCount: number,
  minimumCount: number,
  maxTime: string,
  minimumTime: string,
  averageCount: number,
  averagesByHour: number[]
}
