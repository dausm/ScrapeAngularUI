export interface WeeklyAverage {
  id: number,
  name: string,
  weekRange: string,
  startDate: string,
  endDate: string,
  averageCount: number,
  maxCount: number,
  minimumCount: number,
  maxTime: string,
  minimumTime: string,
  averagesByHour: number[]
}
