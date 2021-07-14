/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/display-name */
import {ReactElement} from 'react';

import {ComponentItemProps, FormGeneratorSchemeType} from './types';

export type FormGeneratorItems = Record<
  string,
  // eslint-disable-next-line no-unused-vars
  (props: ComponentItemProps) => (ReactElement | null)
>;

export const defaultFormItemsByType: FormGeneratorItems = {
  [FormGeneratorSchemeType.SELECT]: () => <>tmp</>,
  [FormGeneratorSchemeType.MULTI_SELECT]: () => <>tmp</>,
  [FormGeneratorSchemeType.RANGE]: () => <>tmp</>,
};
