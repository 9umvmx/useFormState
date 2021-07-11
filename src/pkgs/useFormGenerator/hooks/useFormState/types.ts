/* eslint-disable no-unused-vars */
import {SetState} from '../../types';

export type ExpandSetState<S> = SetState<S> & {
  byKeys: (keys: string[]) => ExpandSetState<any>;
};
