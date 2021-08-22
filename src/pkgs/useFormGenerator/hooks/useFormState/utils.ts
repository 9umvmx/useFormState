import {SetState} from '../../types';
import {
  isFunction,
  isNull,
  isObject,
  isUndefined,
  objectChangeValueByKeys,
  objectGetValue,
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

      const getNewValue = (thatValue: any) => objectChangeValueByKeys(preState, keys, thatValue);

      return (() => {
        if (isFunction(newValue)) {
          const prevStateByKeys = objectGetValue(preState as any, keys);
          return getNewValue(newValue(prevStateByKeys));
        }

        return getNewValue(newValue);
      })();
    });
  };

  newSetState.byKeys = createSetStateByKeys(newSetState);

  return newSetState;
};

