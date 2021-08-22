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

/**
 * Мутирует значение
 */
export const createFormSetState // CreateFormSetState
  = <S extends SetState<any> = SetState<any>>
    (setState: FormSetState<S>) => {
    setState.byKeys = createSetStateByKeys(setState);

    return setState;
  };

type SetStateAny = SetState<any>;
type FormSetState<S extends SetStateAny> = S & { // S & { extend
  byKeys: (keys: string[]) => SetStateAny;
}

export const createSetStateByKeys // CreateSetStateByKeys
  = (setState: SetStateAny) => {
    return (keys: string[]) => {
      const newSetState = createNewSetStateByKeys(setState, keys);

      return createSetStateByKeys(newSetState);
    };
  };

const createNewSetStateByKeys // CreateNewSetStateByKeys
  = (setState: SetStateAny, keys: string[]) => {
    return (newValue: any): void =>
      setState((preState: any) => { // Dispatch SetState
        // CheckValid and mutate
        if (isUndefined(preState) || isNull(preState)) {
          preState = {};
        }

        if (!isObject(preState)) {
          throw new Error(
            `${useFormState.name}/setStateByKeys не предыдущее состояние !object (N23420&9df2334)`,
          );
        }

        const getNewValue = (newStateByKeys: SetStateAny) => {
          return objectChangeValueByKeys(preState, keys, newStateByKeys);
        };

        return (() => { // Start function
          if (isFunction(newValue)) {
            const prevStateByKeys = objectGetValueByKeys(preState, keys);
            return getNewValue(newValue(prevStateByKeys));
          }

          return getNewValue(newValue);
        })(); // End function
      });
  };
