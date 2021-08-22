import {SetState} from '../../types';
import {
  isFunction,
  isNull,
  isObject,
  isUndefined,
  objectChangeValueByKeys,
  objectGetValueByKeys,
} from '../../utils';

import {useFormState} from '.';

export const createSetStateByKeys = (currentSetState: SetState<any>) => (keys: string[]) => {
  const newSetState = (newValue: any) => {
    currentSetState((preState: any) => {
      if (isUndefined(preState) || isNull(preState)) {
        preState = {};
      }

      if (!isObject(preState)) {
        throw new Error(
          `${useFormState.name}/setStateByKeys не предыдущее состояние !object (N23420&9df2334)`,
        );
      }

      const getNewValue = (newStateByKeys: any) => objectChangeValueByKeys(preState, keys, newStateByKeys);

      return (() => {
        if (isFunction(newValue)) {
          const prevStateByKeys = objectGetValueByKeys(preState, keys);
          return getNewValue(newValue(prevStateByKeys));
        }

        return getNewValue(newValue);
      })();
    });
  };

  return createSetStateByKeys(newSetState);
};

type FormSetState<S extends SetState<any>> = S & {
  byKeys: (keys: string[]) => SetState<any>;
}

/**
 * Мутирует значение
 */
export const createFormSetState = <S extends SetState<any> = SetState<any>>
  (setState: FormSetState<S>) => {
  setState.byKeys = createSetStateByKeys(setState);

  return setState;
};
