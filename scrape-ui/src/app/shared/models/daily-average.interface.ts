export interface DailyAverage {
  id: number,
  name: string,
  dateCalculated: string,
  dayOfWeek: string,
  maxCount: number,
  minimumCount: number,
  maxTime: number,
  minimumTime: number,
  averageCount: number,
  averagesByHour: number[]
}
