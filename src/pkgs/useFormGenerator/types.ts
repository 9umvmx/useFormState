/* eslint-disable no-unused-vars */

// React
// eslint-disable-next-line no-unused-vars
export type ParameterSetState<S> = S | ((prevState: S) => S);
export type SetState<S> = (newState: ParameterSetState<S>) => void;
export type UseState<S> = [S, SetState<S>];

// Types utils
export type RecordKey = string | number;
export type RecordAny = Record<any, any>
export type RecordStringAny = Record<string, any>;
export type RecordString = Record<string, string>;
