import React from 'react';
import {Select as SelectUiKit} from 'ui-kit';
import {FormGeneratorSchemeType} from '..';
import {ComponentItemProps, GenericSchemeItem} from '../types';
import {ISelectProps} from 'ui-kit/select/types';

export type SchemeItemMultiSelect = {
  type: FormGeneratorSchemeType.MULTI_SELECT
  title: ISelectProps['title'];
  options: ISelectProps['options'];
  required?: ISelectProps['required'];
}

type MultiSelectProps = ComponentItemProps<
  GenericSchemeItem<SchemeItemMultiSelect>
>;

export const MultiSelect: React.FC<MultiSelectProps> = ({
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
    isMulti
  />
);
