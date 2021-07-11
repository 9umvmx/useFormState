import {SetState} from 'types';
import {SchemeItemSelect} from './components/Select';
import {SchemeItemMultiSelect} from './components/MultiSelect';
import {SchemeItemRange} from './components/Range';

export type FormItemData = any;

export enum FormGeneratorSchemeType {
  SELECT = 'select',
  MULTI_SELECT = 'multiSelect',
  RANGE = 'range'
}

export type GenericSchemeItem<S> = { key: string } & S;

export interface ISchemeItemProps {
  type: string;
  key: string;
}

export type SchemeItemPropsFormGenerator = GenericSchemeItem<(
  | SchemeItemSelect
  | SchemeItemMultiSelect
  | SchemeItemRange
)>;

export type FormItemProps = {
  onChange: SetState<FormItemData>,
  data: FormItemData,
  defaultData: FormItemData,
  initialData: FormItemData
}

/**
 * @param S что бы показать возможные типы и any что бы не ломался
   typeScript в пропсе каждого частного компонента тип которого известен точно
 */
export type ComponentItemProps<S = SchemeItemPropsFormGenerator | any> = {
  formGeneratorProps: FormItemProps;
  schemeProps: S;
  renderProps: Record<string, any>;
}

type UsualSchemeItem = {
  type: string;
  keys: string[]
  formItemName: string;
}

export type UsualScheme = UsualSchemeItem[];
