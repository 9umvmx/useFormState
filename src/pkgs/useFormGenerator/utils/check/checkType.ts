export const isNumber = (value: any): boolean => {
  return !isNaN(value) && typeof value === 'number';
};

export const isString = (value: any): boolean => {
  return typeof value === 'string';
};

export const isFunction = (fn: any): boolean => {
  return typeof fn === 'function';
};

export const isUndefined = (value: any): boolean => {
  return typeof value === 'undefined';
};

export const isObject = (value: any): boolean => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const isNull = (value: any) => value === null;

export const isEmptyString = (value: any) => value === '';
