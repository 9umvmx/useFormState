import {
  createRecord,
  deleteEmptyKey,
  enhanceSourceData,
  normalizeData,
  objectChangeValueByKeys,
  objectFilter,
  objectFromNestedEntries,
  objectGetNestedKeys,
  objectGetValue,
  objectGrouping,
  objectJoinNestedKeys,
  objectMap,
  objectNestedEntries,
  objectToQueryString,
  parseQuery,
} from './object';

describe('utils object', () => {
  test(createRecord.name, () => {
    expect(createRecord(['aaa', 'bbb'], () => true)).toStrictEqual({ aaa: true, bbb: true });
  });

  describe(objectGetValue.name, () => {
    test('simple test', () => {
      expect(objectGetValue({ keyA: 'aaa' }, ['keyA'])).toBe('aaa');
    });

    test('nested test', () => {
      expect(objectGetValue({ keyA: { keyB: 'bbb' } }, ['keyA', 'keyB'])).toBe('bbb');
    });

    test('invalid key test', () => {
      expect(objectGetValue({ keyA: undefined }, ['keyA', 'keyB'])).toBeUndefined();
      expect(objectGetValue({ keyA: null }, ['keyA', 'keyB'])).toBeUndefined();
    });
  });

  test(deleteEmptyKey.name, () => {
    expect(
      deleteEmptyKey({
        a: undefined,
        b: null,
        c: 0,
        d: '',
      })
    ).toStrictEqual({ b: null, c: 0, d: '' });
  });

  describe(objectNestedEntries, () => {
    test('simple test', () => {
      expect(
        objectNestedEntries({ a: { bb: { ggg: 'c', x: { y: { z: 'q0', u: 't4' } } } } })
      ).toStrictEqual([
        [['a', 'bb', 'ggg'], 'c'],
        [['a', 'bb', 'x', 'y', 'z'], 'q0'],
        [['a', 'bb', 'x', 'y', 'u'], 't4'],
      ]);
    });
  });

  describe(objectGetNestedKeys.name, () => {
    test('simple tests', () => {
      expect(objectGetNestedKeys({ a: { bb: 'c' } })).toStrictEqual([['a', 'bb']]);
      expect(objectGetNestedKeys({ a: { bb: 'c' }, dd: 'y' })).toStrictEqual([['a', 'bb'], ['dd']]);
      expect(objectGetNestedKeys({ a: { bb: { ggg: 'c' } } })).toStrictEqual([['a', 'bb', 'ggg']]);
      expect(
        objectGetNestedKeys({ a: { bb: { ggg: 'c', x: { y: { z: 'q0', u: 't4' } } } } })
      ).toStrictEqual([
        ['a', 'bb', 'ggg'],
        ['a', 'bb', 'x', 'y', 'z'],
        ['a', 'bb', 'x', 'y', 'u'],
      ]);
    });
  });

  describe(objectJoinNestedKeys.name, () => {
    test('simple test', () => {
      expect(objectJoinNestedKeys({ a: { bb: 'c' } })).toStrictEqual({ 'a.bb': 'c' });
    });
    test('custom join test', () => {
      expect(
        objectJoinNestedKeys({ a: { bb: 'c', z: 'i' } }, (keys) => keys.join('->'))
      ).toStrictEqual({
        'a->bb': 'c',
        'a->z': 'i',
      });
      expect(
        objectJoinNestedKeys({ a: { bb: 'c', z: 'i' } }, (keys) =>
          keys.map((i) => `[${i}]`).join('')
        )
      ).toStrictEqual({
        '[a][bb]': 'c',
        '[a][z]': 'i',
      });
    });
  });

  describe(objectToQueryString.name, () => {
    test('simple test', () => {
      expect(objectToQueryString({ a: 'aa', b: 'bb' })).toBe('a=aa&b=bb');
    });
    test('nested test', () => {
      expect(objectToQueryString({ a: 'aa', b: { ccc: 'gg' } })).toBe('a=aa&b.ccc=gg');
    });
    test('custom toString test', () => {
      expect(
        objectToQueryString(
          { a: 'aa', b: { ccc: 'gg', z: ['i4', 'i6'], t: [] } },
          ([key, value]) => {
            if (Array.isArray(value)) return `${key}=${value.length ? value.join(',') : 'null'}`;

            return `${key}=${value}`;
          }
        )
      ).toBe('a=aa&b.ccc=gg&b.z=i4,i6&b.t=null');
    });
  });

  describe(objectFromNestedEntries, () => {
    test('simple test', () => {
      expect(
        objectFromNestedEntries([
          [['a', 'b'], 23],
          [['a', 'c'], 44],
          [['bb'], 534],
          [['g', 'a', 'k'], 34],
          [['g', 'a', 'c'], 99],
        ])
      ).toStrictEqual({ a: { b: 23, c: 44 }, bb: 534, g: { a: { k: 34, c: 99 } } });
    });

    describe(objectGrouping.name, () => {
      test('simple test', () => {
        const obj = {
          1: { age: 10, name: 'Вася' },
          2: { age: 80, name: 'Артём' },
          6: { age: 15, name: 'Женя' },
          8: { age: 17, name: 'Катя' },
        };

        const received = objectGrouping(obj, {
          adult: ([key, value]) => value.age >= 18,
          notAdult: ([key, value]) => value.age < 18,
        });

        const expected = {
          adult: {
            '2': { age: 80, name: 'Артём' },
          },
          notAdult: {
            '1': { age: 10, name: 'Вася' },
            '6': { age: 15, name: 'Женя' },
            '8': { age: 17, name: 'Катя' },
          },
        };

        expect(received).toStrictEqual(expected);
      });
    });
  });

  describe(normalizeData.name, () => {
    test('simple test', () => {
      expect(
        normalizeData([
          { id: 4, name: 'Вася' },
          { id: 5, name: 'Петя' },
        ])
      ).toStrictEqual({ 4: { id: 4, name: 'Вася' }, 5: { id: 5, name: 'Петя' } });
    });
  });

  describe(enhanceSourceData.name, () => {
    test('simple test', () => {
      expect(
        enhanceSourceData({
          sourceData: [{ id: 7 }, { id: 15 }],
          enhancedData: {
            8: { name: 'Женя', id: 8 },
            7: { name: 'Даша', id: 7 },
            15: { id: 15, name: 'Миша' },
          },
        })
      ).toStrictEqual([
        { id: 7, name: 'Даша' },
        { id: 15, name: 'Миша' },
      ]);
    });
  });

  describe(objectFilter.name, () => {
    test('simple test', () => {
      const obj = {
        8: { age: 44, name: 'Женя', id: 8 },
        7: { age: 14, name: 'Даша', id: 7 },
        15: { age: 24, id: 15, name: 'Миша' },
      };
      const predicate = ([key, value]) => value.age > 18;

      const received = objectFilter(obj, predicate);
      const expected = {
        8: { age: 44, name: 'Женя', id: 8 },
        15: { age: 24, id: 15, name: 'Миша' },
      };

      expect(received).toStrictEqual(expected);
    });
  });

  describe(parseQuery.name, () => {
    const received = parseQuery('HEIGHT=10999&WIDTH=10999');
    const expected = {
      HEIGHT: '10999',
      WIDTH: '10999',
    };

    expect(received).toStrictEqual(expected);
  });

  describe(objectMap.name, () => {
    const obj = { vasya: 43, petya: 22 };
    const callbackfn = ([key, value]) => [key, value + 2];
    const received = objectMap(obj, callbackfn);
    const expected = { vasya: 45, petya: 24 };

    expect(received).toStrictEqual(expected);
  });

  describe(objectChangeValueByKeys.name, () => {
    test('simple test', () => {
      const oldValue = false;
      const obj = { a: { b: { c: oldValue, test: 'test' }, test: 'test' }, test: 'test' };
      const newValue = true;

      expect(objectChangeValueByKeys(obj, ['a', 'b', 'c'], newValue)).toStrictEqual({
        a: { b: { c: newValue, test: 'test' }, test: 'test' },
        test: 'test',
      });
    });
  });
});
