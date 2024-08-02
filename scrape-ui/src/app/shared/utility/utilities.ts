import { HttpErrorResponse } from "@angular/common/http";

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

export function contains(str: string, arr: string[]): boolean {
  return arr.some(element => str.includes(element));
}

export function getSelectElementValue($event: Event): string {
  return ($event.target as HTMLSelectElement).value ?? '';
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
 * Formats a string as Date into hh:mm format TODO update these
 * @param dateAsString
 * @returns string in hh:mm format
 */

export function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter(k => !Number.isNaN(k)) as K[]
}

export function enumValues<O extends object>(obj: O): Array<O[keyof O]> {
  return Object.values(obj).filter(k => !Number.isNaN(k)) as Array<O[keyof O]>
}

export function getTimeInMilliseconds(dateAsString: string): number {
  let date = new Date(dateAsString);
  date.setFullYear(1970, 0, 1);
  return date.getTime();
}
