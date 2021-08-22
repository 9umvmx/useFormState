import {useDebugValue, useState} from 'react';
import {SetState} from '../../types';

import {createFormSetState, createSetStateByKeys, FormSetState} from './utils';

export const useFormState = <S = any>(initialData?: S) => {
  const [state, setState] = useState(initialData);
  createFormSetState(setState as SetState<any>);

  return [state, setState] as [S, FormSetState<S & any>];
};
