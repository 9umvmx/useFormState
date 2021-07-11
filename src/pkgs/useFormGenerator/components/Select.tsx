import React from 'react';

import {Select as SelectUiKit} from 'ui-kit';
import {ComponentItemProps, FormGeneratorSchemeType, GenericSchemeItem} from '../types';
import {ISelectProps} from 'ui-kit/select/types';

export type SchemeItemSelect = {
  type: FormGeneratorSchemeType.SELECT;
  title: ISelectProps['title'];
  options: ISelectProps['options'];
  required?: ISelectProps['required'];
};

type SelectProps = ComponentItemProps<GenericSchemeItem<SchemeItemSelect>>;

export const Select: React.FC<SelectProps> = ({
  schemeProps: {
    options,
    title,
    required,
    key,
  },
}) => (
  <SelectUiKit
    title={title}
    name={key}
    options={options}
    required={required}
  />
);
