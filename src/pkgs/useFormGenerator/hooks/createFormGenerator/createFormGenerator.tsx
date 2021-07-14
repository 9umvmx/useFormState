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
import {objectGetValue, isFunction, isUndefined} from '../../utils';
import {ExpandSetState} from '../useFormState/types';
import {AnyRecord} from '../../types';

export type FormGeneratorData = undefined | AnyRecord;

type RenderProps = Record<string, any>;

type useFormGeneratorProps<SchemeProps extends ISchemeItemProps> = {
  formData?: FormGeneratorData;
  scheme: UsualScheme;
  propsAllFormItems?: Record<string, any>;
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
    const formGeneratorItems = (() => {
      if (!scheme.length) {
        return {};
      }

      return Object.fromEntries(scheme.map(
        (schemeItemProps: UsualSchemeItem) => {
          return [
            schemeItemProps.formItemName,
            (renderProps: AnyRecord) => (
              <RenderItemsWrapper
                key={schemeItemProps.formItemName}
                propsAllFormItems={propsAllFormItems}
                formGeneratorProps={{
                  onChange: setFormData.byKeys(schemeItemProps.keys),
                  data: objectGetValue(formData, schemeItemProps.keys),
                  initialData: objectGetValue(initialFormData, schemeItemProps.keys),
                }}
                schemeProps={schemeItemProps}
                renderProps={renderProps}
                formItemsByType={formItemsByType[schemeItemProps.type] as any}
              />
            ),
          ];
        },
      ));
    })();

    return {formItems: formGeneratorItems};
  };
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
  renderProps: RenderProps;
  propsAllFormItems?: AnyRecord;
}

// Вынес в обёртку что бы можно было создавать хуки в нутри элементов формы
// В противном случае будет ругаться что количество хуков за рендер изминалось
const RenderItemsWrapper = <SchemeProps extends UsualSchemeItem>({
  formItemsByType,
  formGeneratorProps,
  schemeProps,
  renderProps,
  propsAllFormItems,
}: RenderItemsWrapperProps<any>) => (
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
