import moment from 'moment';

export function getCustomDate(daysAgo: number): string {
  return moment().subtract(daysAgo, 'days').format();
}

export function get1YearAgo(): string {
  return moment().subtract(1, 'years').format();
}

export function isValidDate(value: string): boolean {
  return moment(value).isValid();
}
