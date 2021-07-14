import {isFunction} from '../../utils';

import {createSetStateByKeys} from './utils';

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
});
