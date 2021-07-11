import {useState} from 'react';
import {ExpandSetState} from './types';

import {createSetStateByKeys} from './utils';

export const useFormState = <S>(initialData?: S) => {
  const [state, setState] = useState(initialData) as [S, ExpandSetState<S>];

  setState.byKeys = createSetStateByKeys(setState) as any;

  return [state, setState] as const;
};
