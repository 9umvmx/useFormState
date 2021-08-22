import React, {useMemo} from 'react';
import {
  FormGenItemProps,
  FormItemData,
  SchemeItemPropsFormGenerator,
  ISchemeItemProps,
  UsualScheme,
  UsualSchemeItem,
} from './types';
import {defaultFormItemsByType, FormGeneratorItems} from './formItemsByType';
import {objectGetValueByKeys, isFunction, isUndefined} from '../../utils';
import {ExpandSetState} from '../useFormState/types';
import {RecordAny} from '../../types';

export type FormGeneratorData = undefined | RecordAny;

type RecordStringAny = Record<string, any>;

type useFormGeneratorProps<SchemeProps extends ISchemeItemProps> = {
  formData?: FormGeneratorData;
  scheme: UsualScheme;
  propsAllFormItems?: RecordStringAny;
  setFormData: ExpandSetState<FormGeneratorData>;
  initialFormData?: FormGeneratorData;
};

export const createFormGenerator = function<SchemeProps extends ISchemeItemProps> (
  formItemsByType: FormGeneratorItems,
) {
  return ({
    formData,
    setFormData,
    initialFormData,
    scheme,
    propsAllFormItems,
  }: useFormGeneratorProps<SchemeProps>) => {
    const formGeneratorItems = createFormItems(scheme);

    return {formItems: formGeneratorItems};
  };
};

const createFormItems = (scheme: UsualScheme, propsAllFormItems) => {
  if (!scheme.length) {
    return {};
  }

  return Object.fromEntries(scheme.map(
    (schemeItemProps: UsualSchemeItem) => {
      return [
        schemeItemProps.formItemName,
        (renderProps?: RecordAny) => (
          <RenderItemsWrapper
            key={schemeItemProps.formItemName}
            propsAllFormItems={propsAllFormItems}
            formGeneratorProps={{
              onChange: setFormData.byKeys(schemeItemProps.keys),
              data: objectGetValueByKeys(formData, schemeItemProps.keys),
              initialData: objectGetValueByKeys(initialFormData, schemeItemProps.keys),
            }}
            schemeProps={schemeItemProps}
            renderProps={renderProps}
            formItemsByType={formItemsByType}
          />
        ),
      ];
    },
  ));
};

/**
 * @deprecated defaultFormItemsByType не отлажены
 * На данный момент используются только локальные кастомные item у lots
 */
export const useFormGenerator = createFormGenerator<
  SchemeItemPropsFormGenerator
>(defaultFormItemsByType);

type RenderItemsWrapperProps<SchemeProps extends ISchemeItemProps> = {
  formItemsByType: FormGeneratorItems;
  formGeneratorProps: FormGenItemProps;
  schemeProps: SchemeProps;
  renderProps?: any;
  propsAllFormItems?: RecordAny;
}

// Вынес в обёртку что бы можно было создавать хуки в нутри элементов формы
// В противном случае будет ругаться что количество хуков за рендер изминалось
const RenderItemsWrapper = <SchemeProps extends UsualSchemeItem>({
  formItemsByType,
  formGeneratorProps,
  schemeProps,
  renderProps,
  propsAllFormItems,
}: RenderItemsWrapperProps<any>) => {
  return (
    <>
      {
        formItemsByType[schemeProps.type]({
          formGeneratorProps,
          schemeProps,
          renderProps,
          propsAllFormItems,
        })
      }
    </>
  );
};
