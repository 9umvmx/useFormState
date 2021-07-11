import {isFunction, isNumber, isObject, isString} from './checkType';

describe('checkType', () => {
  describe(isNumber.name, () => {
    test('NaN', () => {
      expect(isNumber(NaN)).toBe(false);
    });
    test('number', () => {
      expect(isNumber(2)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber(-10)).toBe(true);
    });
  });

  describe(isString.name, () => {
    test('default string', () => {
      expect(isString('default')).toBe(true);
    });
    test('empty string', () => {
      expect(isString('')).toBe(true);
    });
  });

  describe(isFunction.name, () => {
    test('simple test', () => {
      expect(isFunction(() => {})).toBe(true);
    });
  });

  describe(isObject.name, () => {
    test('simple test', () => {
      expect(isObject({})).toBe(true);
    });
    test('failure null', () => {
      expect(isObject(null)).toBe(false);
    });
    test('failure array', () => {
      expect(isObject([])).toBe(false);
    });
  });
});
