import {SetState} from '../../types';
import {RecordAny} from '../../types';

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
  any
)>;

export type FormGenItemProps = {
  onChange: SetState<FormItemData>,
  data: FormItemData,
  initialData: FormItemData
}

/**
 * @param S что бы показать возможные типы и any что бы не ломался
   typeScript в пропсе каждого частного компонента тип которого известен точно
 */
export type ComponentItemProps<S = SchemeItemPropsFormGenerator | any> = {
  formGeneratorProps: FormGenItemProps;
  schemeProps: S;
  renderProps: any;
  propsAllFormItems?: RecordAny;
}

export type UsualSchemeItem = {
  type: string;
  keys: string[]
  formItemName: string;
}

export type UsualScheme = UsualSchemeItem[];
