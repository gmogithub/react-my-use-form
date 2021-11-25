import {JSUtils} from "../JSUtils";

export function parseInteger(value: any) {
  return parseInt(value, 10);
}

export function parseIban(value: string) {
  if (JSUtils.isString(value)) {
    if (!value) return value;
    return value.replace(new RegExp(' ', 'g'), '').toUpperCase();
  }
  return '';
}
