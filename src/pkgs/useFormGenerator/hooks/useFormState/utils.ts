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
    (setState: SetState<S> & FormSetState<S>) => {
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

      return createFormSetState(newSetState);
    };
  };

const createNewSetStateByKeys // CreateNewSetStateByKeys
  = ( // Variables
    setState: SetStateAny,
    keys: string[],
  ) => {
    return (newValue: any): void => // Create Dispatch SetState
      setState((preState: any) => { // Dispatch SetState
        // CheckValid
        if (isUndefined(preState) || isNull(preState)) {
          preState = {}; // Mutate
        }

        if (!isObject(preState)) {
          throw new Error(
            `${useFormState.name}/setStateByKeys не предыдущее состояние !object (N23420&9df2334)`,
          );
        }

        // Main content
        return (() => { // Start function
          if (isFunction(newValue)) {
            const prevStateByKeys = objectGetValueByKeys(preState, keys);
            return objectChangeValueByKeys(preState, keys, newValue(prevStateByKeys));
          }

          return objectChangeValueByKeys(preState, keys, newValue);
        })(); // End function
      }); // End Dispatch SetState
  };
