export function classNames(...values: any[]) {
  return values.filter((value) => typeof value == 'string').join(' ');
}
