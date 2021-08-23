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
import {Errors} from '../../const';
import {arrayChangeByIndex} from '../../utils/array';

/**
 * Мутирует значение
 */
export const createFormSetState // CreateFormSetState
  = <S extends SetState<any> = SetState<any>>
    (setState: SetState<S> & FormSetState<S>) => {
    setState.byKeys = createSetStateByKeys(setState);
    setState.byIndx = createSetStateByIndex(setState);

    return setState;
  };

type SetStateAny = SetState<any>;
export type FormSetState<S extends SetStateAny> = S & { // S & { extend
  byKeys: (keys: string[]) => SetStateAny;
  byIndx: (index: number) => SetStateAny;
}

// SET_STATE_BY_KEYS
export const createSetStateByKeys // CreateSetStateByKeys
  = (setState: SetStateAny) => {
    return (keys: string[]) => {
      const nestedSetState = createDispatchSetStateByKeys(setState, keys);

      return createFormSetState(nestedSetState);
    };
  };

const createDispatchSetStateByKeys // CreateDispatchSetStateByKeys
  = ( // Variables
    setState: SetStateAny,
    keys: string[],
  ) => {
    return (newValue: any): void =>
      setState((preState: any) => { // Dispatch SetState
        // CheckValid
        if (isUndefined(preState) || isNull(preState)) {
          preState = {}; // Mutate
        }

        if (!isObject(preState)) {
          throw new Error(
            `${useFormState.name}/setStateByKeys не предыдущее состояние ${Errors[1]}`,
          );
        }

        // Main content
        const prevStateByKeys = objectGetValueByKeys(preState, keys);

        return objectChangeValueByKeys(
          preState,
          keys,
          isFunction(newValue)
            ? newValue(prevStateByKeys)
            : newValue,
        );
      }); // End Dispatch SetState
  };

// SET_STATE_BY_INDEX
export const createSetStateByIndex // CreateSetStateByIndex
  = (setState: SetStateAny) => {
    return (index: number) => {
      const setStateByIndex = createDispatchSetStateByIndex(setState, index);

      return createFormSetState(setStateByIndex);
    };
  };

const createDispatchSetStateByIndex = (setState: SetStateAny, index: number) => {
  return (newValue: any): void =>
    setState((prevState: any) => { // Dispatch SetState
      // CheckValid
      if (isUndefined(prevState) || isNull(prevState)) {
        prevState = []; // Mutate
      }

      if (!Array.isArray(prevState)) {
        throw new Error(
          `${useFormState.name}/setStateByIndex не предыдущее состояние !value ${Errors[2]}`,
        );
      }

      // Main content
      return arrayChangeByIndex(
        prevState,
        index,
        isFunction(newValue)
          ? newValue(prevState[index])
          : newValue,
      );
    }); // End Dispatch SetState
};
