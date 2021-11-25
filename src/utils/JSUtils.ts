import { StringUtils } from "./StringUtils";


interface ObjectClone {
  [otherProp: string]: any;
}

export class JSUtils {
  static UID(number: number = 10): number {
    return Math.floor(Math.random() * 10 ** number);
  }

  static UUID(): string {
    let s: Array<any> = [];
    const itoh = '0123456789ABCDEF';
    for (let i = 0; i < 36; i++) {
      s[i] = Math.floor(Math.random() * 0x10);
    }

    s[14] = 4;
    s[19] = (s[19] & 0x3) | 0x8;

    for (let j = 0; j < 36; j++) {
      s[j] = itoh[s[j]];
    }

    s[8] = s[13] = s[18] = s[23] = '-';
    return s.join('');
  }

  static isArray<T = any>(value: any): value is Array<T> {
    return value instanceof Array;
  }

  static isString(value: any): value is string {
    return typeof value === 'string';
  }

  static isBoolean(value: any): value is boolean {
    return typeof value === 'boolean';
  }

  static isObject(value: any): boolean {
    return typeof value === 'object';
  }

  static isFunction(value: any): value is Function {
    return typeof value === 'function';
  }

  static isNumber(value: any): value is number {
    return typeof value === 'number' && isFinite(value);
  }

  static parseObject(obj: any, values: any): any {
    return JSUtils._parseObjectProperties(obj, values);
  }

  private static _parseObjectProperties(obj: any, values: any): any {
    let value;
    return Object.keys(obj).reduce((object, propertyName) => {
      value = obj[propertyName];
      if (JSUtils.isString(value)) {
        value = StringUtils.parse(value, values);
      } else if (JSUtils.isObject(value)) {
        value = JSUtils._parseObjectProperties(value, values);
      }
      return { ...object, [propertyName]: value };
    }, {});
  }

  static cloneDeep(value: any): any {
    if (value === null || value === undefined) {
      return value;
    }
    if (JSUtils.isArray(value)) {
      return JSUtils._cloneArray(value);
    } else if (JSUtils.isObject(value)) {
      if (value instanceof Date) {
        return new Date(value);
      }
      return JSUtils._cloneObject(value);
    } else {
      return JSUtils._clone(value);
    }
  }

  static _cloneObject(obj: ObjectClone) {
    return Object.keys(obj).reduce((acc: any, property) => {
      acc[property] = JSUtils.cloneDeep(obj[property]);
      return acc;
    }, {});
  }

  static _cloneArray(array: Array<any>): Array<any> {
    return array.map(item => JSUtils.cloneDeep(item));
  }

  static _clone(value: any): any {
    return value;
  }

  static getValueFromObject(obj: any, path: any, valueDefault: any = null) {
    let properties = path.split('.');
    let valueTmp = obj;
    let value;
    let prop;
    let valid = true;
    for (let i = 0, l = properties.length; i < l; i++) {
      prop = properties[i];
      valueTmp = valueTmp[prop];
      if (i !== l - 1) {
        if (valueTmp === undefined || valueTmp === null) {
          valid = false;
          break;
        }
      } else {
        if (valueTmp === undefined) {
          valid = false;
          break;
        }
      }
    }

    if (!valid) {
      value = valueDefault;
    } else {
      value = valueTmp;
    }

    return value;
  }

  static isObjectEmpty(object: any) {
    return Object.entries(object).length === 0 && object.constructor === Object;
  }

  static isNullOrUndefined(variable: any) {
    return variable === null || variable === undefined;
  }

  static copyToClipboard(data: string) {
    navigator.clipboard.writeText(data);
  }

  static exportStringAsFile(fileName: string, dataType: string, data: string) {
    if (fileName === undefined || fileName === null || fileName.length === 0) {
      throw new Error("Exported file must have a name");
    }
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = 'none';
    let blob = new Blob([data], { type: dataType });
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 0);
  }

  static objectToMapKeyIsNumber<T>(toMap: Object): Map<number, T> {
    let objectMap: Map<string, any> = new Map(Object.entries(toMap));
    let newMap: Map<number, T> = new Map();
    objectMap.forEach((value, key) => newMap.set(parseInt(key), value));
    return newMap;
  }

  static objectToMapKeyIsString<T>(toMap: Object): Map<string, T> {
    return new Map<string, T>(Object.entries(toMap));
  }

  static mapToObject(toObject: Map<any, any>): Object {
    return Object.fromEntries(toObject);
  }
}
