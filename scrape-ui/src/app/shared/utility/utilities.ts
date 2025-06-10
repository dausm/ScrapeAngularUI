import { HttpErrorResponse } from "@angular/common/http";
import { WritableSignal } from "@angular/core";
import { DailyAverage } from "../models/daily-average.interface";
import { WeeklyAverage } from "../models/weekly-average.interface";
import { defer, Observable } from "rxjs";

/**
 * Logs the error to the console and returns the message as a string.
 * @param err Error thrown
 * @returns string of the error message.
 */
export function setErrorMessage(err: HttpErrorResponse): string {
  let errorMessage: string;
  if (err.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    errorMessage = `An error occurred: ${err.error.message}`;
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    errorMessage = `Backend returned code ${err.status}: ${err.message}`;
  }
  console.error(err);
  return errorMessage;
}

/**
 * Formats a string as Date into MM/DD format
 * @param dateAsString
 * @returns string in MM/DD format
 */
export function formatMonthDayFromDate(dateAsString: string): string {
  const date = new Date(dateAsString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}/${day}`;
}

/**
 * Takes an enum and gets the keys
 * @param obj enum to iterate
 * @returns An array of the enum's keys
 */
export function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter(k => !Number.isNaN(k)) as K[]
}

/**
 * Takes an enum and gets the values as an array
 * @param obj enum to iterate
 * @returns An array of the enum values
 */
export function enumValues<O extends object>(obj: O): Array<O[keyof O]> {
  return Object.values(obj).filter(k => !Number.isNaN(k)) as Array<O[keyof O]>
}

/**
 * Converts a string date to milliseconds.
 * @param dateAsString string of the date
 * @returns A number representing the milliseconds
 */
export function getTimeInMilliseconds(dateAsString: string): number {
  let date = new Date(dateAsString);
  date.setFullYear(1970, 0, 1);
  return date.getTime();
}

/**
 * Creates a writable signal to update.
 * @param sg signal to update
 * @returns a writable signal.
 */
export const makeUpdater = <T>(sg: WritableSignal<T>) =>
  <K extends keyof T>(prop: K, value: T[K]) =>
    sg.update(obj => ({
      ...obj,
      [prop]: value
    }));

/**
 * Checks if an object is type DailyAverage
 * @param value object to check.
 * @returns a boolean
 */
export function isDailyAverage(value: DailyAverage | WeeklyAverage): value is DailyAverage {
  return (<DailyAverage>value).dateCalculated !== undefined;
}

/**
 * Create async observable that emits-once and completes after a JS engine turn.
 * @param data data to be returned by the observable
 * @returns an observable that succeeds
 */
export function asyncData<T>(data: T): Observable<Awaited<T>> {
  return defer(() => Promise.resolve(data));
}

/**
 * Create async observable error that errors after a JS engine turn
 * @param errorObject error to be thrown
 * @returns an observable that throws an error.
 */
export function asyncError<T>(errorObject: any): Observable<never> {
  return defer(() => Promise.reject(errorObject));
}
