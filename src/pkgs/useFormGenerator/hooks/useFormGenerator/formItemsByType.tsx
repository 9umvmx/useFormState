import {ReactElement} from 'react';

import {ComponentItemProps, FormGeneratorSchemeType} from './types';
import {Select} from '../../components/Select';
import {MultiSelect} from '../../components/MultiSelect';
import {Range} from '../../components/Range';

export type FormGeneratorItems = Record<
  string,
  // eslint-disable-next-line no-unused-vars
  (props: ComponentItemProps) => (ReactElement | null)
>;

export const defaultFormItemsByType: FormGeneratorItems = {
  [FormGeneratorSchemeType.SELECT]: Select,
  [FormGeneratorSchemeType.MULTI_SELECT]: MultiSelect,
  [FormGeneratorSchemeType.RANGE]: Range,
};
