import React from 'react';
import InputNumberRange from 'ui-kit/input-number-range';
import {ComponentItemProps, GenericSchemeItem, FormGeneratorSchemeType} from '../types';
import {IInputNumberRangeProps} from 'ui-kit/input-number-range/types';

export type SchemeItemRange = {
  type: FormGeneratorSchemeType.RANGE
  title: IInputNumberRangeProps['label'];
  max: number;
  min: number;
}

type RangeProps = ComponentItemProps<GenericSchemeItem<SchemeItemRange>>;

export const Range: React.FC<RangeProps> = ({
  schemeProps: {
    title,
    key,
  },
}) => (
  <InputNumberRange
    label={title}
    name={key}
    onFinalChange={() => {}}
    onChange={() => {}}
    value={[10, 40]}
    max={50}
    min={0}
  />
);
