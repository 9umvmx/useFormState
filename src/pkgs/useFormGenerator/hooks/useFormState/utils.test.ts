import {isFunction} from '../../utils';

import {createFormSetState, createSetStateByIndex, createSetStateByKeys} from './utils';

const createMockSetState = (initialState?: any) => {
  const refState = {current: initialState};

  const getState = () => refState.current;
  const setState = (newState) => {
    if (isFunction(newState)) {
      newState = newState(getState());
    }

    refState.current = newState;
  };

  return [getState, setState];
};

describe('useRecordState', () => {
  describe(createSetStateByKeys.name, () => {
    test('simpleTest', () => {
      const initialState = {a: 'a', b: {c: true, g: '2'}};
      const [getState, setState] = createMockSetState(initialState);

      setState.byKeys = createSetStateByKeys(setState);

      const setStateC = setState.byKeys(['b', 'c']);

      setStateC(false);

      expect(getState()).toStrictEqual({a: 'a', b: {c: false, g: '2'}});
    });
    test('recursion setStateByKeys test', () => {
      const initialState = {
        a: 'a',
        b: {c: {g: 2, test: 'test'}, test: 'test'},
        test: 'test',
      };
      const [getState, setState] = createMockSetState(initialState);

      setState.byKeys = createSetStateByKeys(setState);

      const setStateB = setState.byKeys(['b']);
      const setStateC = setStateB.byKeys(['c', 'g']);

      setStateC((prev) => prev + 8);

      expect(getState()).toStrictEqual({
        a: 'a',
        b: {c: {g: 10, test: 'test'}, test: 'test'},
        test: 'test',
      });
    });
  });

  describe(createSetStateByIndex.name, () => {
    test('simpleTest', () => {
      const [getState, setState] = createMockSetState(['vasya', 2, 'petya']);

      setState.byIndx = createSetStateByIndex(setState);

      const setStateSecondItem = setState.byIndx(1);
      setStateSecondItem(10);

      expect(getState()).toStrictEqual(['vasya', 10, 'petya']);
    });
    test('prevValue test', () => {
      const [getState, setState] = createMockSetState(['vasya', 2, 'petya']);

      setState.byIndx = createSetStateByIndex(setState);

      const setStateSecondItem = setState.byIndx(1);
      setStateSecondItem((prev) => prev - 3);

      expect(getState()).toStrictEqual(['vasya', -1, 'petya']);
    });
    test('zeroIndexTest', () => {
      const [getState, setState] = createMockSetState([2, 'vasya', 'petya']);

      setState.byIndx = createSetStateByIndex(setState);

      const setStateSecondItem = setState.byIndx(0);
      setStateSecondItem(10);

      expect(getState()).toStrictEqual([10, 'vasya', 'petya']);
    });
  });

  describe(createFormSetState.name, () => {
    test('multiTest', () => {
      const [getState, setState] = createMockSetState(['value', 'data', null]);

      createFormSetState(setState); // Мутирует

      const setStateSecondItem = setState.byIndx(2);
      const nestedSetState = setStateSecondItem.byKeys(['a', 'b', 'c']);

      nestedSetState([null, null, null]);
      nestedSetState.byIndx(0)('working');

      expect(getState()).toStrictEqual([
        'value',
        'data',
        {
          a: {b: {c: ['working', null, null]}},
        },
      ]);
    });
  });
});
