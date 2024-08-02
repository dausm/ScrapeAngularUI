export const DateTimeFormat: string = "%A %b %e %I:%M%p";

export const DateOptions: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};


export const DateTimeMinimum: number = new Date(1970,0,1,0,0,0,0).getTime();

export const DateTimeMaximum: number = new Date(1970,0,2,0,0,0,0).getTime();
