import {useDebugValue, useState} from 'react';
import {ExpandSetState} from './types';

import {createFormSetState, createSetStateByKeys} from './utils';

export const useFormState = <S>(initialData?: S) => {
  const [state, setState] = useState(initialData) as [S, ExpandSetState<S>];
  createFormSetState(setState);

  return [state, setState] as const;
};
