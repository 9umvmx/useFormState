import React from 'react';
import {
  FormItemProps,
  FormItemData,
  SchemeItemPropsFormGenerator,
  ISchemeItemProps,
} from './types';
import {defaultFormItemsByType, FormGeneratorItems} from './formItemsByType';
import {objectGetValue, isFunction, isUndefined} from '../../utils';

export type FormGeneratorData = undefined | Record<string, FormItemData>;

const getDataByKey = (key: string, data: FormGeneratorData) => {
  if (isUndefined(data)) {
    return undefined;
  }

  type ThisData = NonNullable<typeof data>;
  data = data as ThisData;
  return objectGetValue(data, [key]);
};

type RenderProps = Record<string, any>;
type GetNewFormData = (prevFormData: FormGeneratorData) => FormGeneratorData;

type useFormGeneratorProps<SchemeProps extends ISchemeItemProps> = {
  formData?: FormGeneratorData;
  setFormData: (getNewFormData: GetNewFormData) => void;
  // Что бы тригириться смены формы
  initialFormData?: FormGeneratorData;
  // Значение по умолчанию для пустой формы
  defaultFormData?: FormGeneratorData;
  scheme: Record<string, SchemeProps>;
  propsAllFormItems: Record<string, any>;
};

export const createUseFormGenerator = function<SchemeProps extends ISchemeItemProps> (
  formItemsByType: FormGeneratorItems,
) {
  return ({
    formData,
    setFormData,
    initialFormData,
    defaultFormData,
    scheme,
    propsAllFormItems,
  }: useFormGeneratorProps<SchemeProps>) => {
    const handleChangeByKey = (key: string) => (newValueByKey: FormItemData) => {
      setFormData((prevFormData: FormGeneratorData) => {
        if (isFunction(newValueByKey)) {
          newValueByKey = newValueByKey(getDataByKey(key, prevFormData));
        }

        return {
          ...prevFormData,
          [key]: newValueByKey,
        };
      });
    };

    const createFormDataItemController = (key: string): FormItemProps => ({
      data: getDataByKey(key, formData),
      initialData: getDataByKey(key, initialFormData),
      defaultData: getDataByKey(key, defaultFormData),
      onChange: handleChangeByKey(key),
    });

    const formGeneratorItems = (() => {
      if (!scheme && !Object.entries(scheme).length) {
        return {};
      }

      return Object.fromEntries(Object.entries(scheme).map(
        ([formItemKey, schemeProps]) => {
          const formDataItemController = createFormDataItemController(formItemKey);
          return [
            formItemKey,
            <RenderItemsWrapper
              key={formItemKey}
              renderProps={propsAllFormItems}
              formItemsByType={formItemsByType}
              formDataItemController={formDataItemController}
              schemeProps={schemeProps}
            />,
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
export const useFormGenerator = createUseFormGenerator<
  SchemeItemPropsFormGenerator
>(defaultFormItemsByType);

type RenderItemsWrapperProps<SchemeProps extends ISchemeItemProps> = {
  formItemsByType:FormGeneratorItems;
  formDataItemController: FormItemProps;
  schemeProps: SchemeProps;
  renderProps: RenderProps;
}

// Вынес в обёртку что бы можно было создавать хуки в нутри элементов формы
// В противном случае будет ругаться что количество хуков за рендер изминалось
const RenderItemsWrapper = React.memo(<SchemeProps extends ISchemeItemProps>({
  formItemsByType,
  formDataItemController,
  schemeProps,
  renderProps,
}: RenderItemsWrapperProps<SchemeProps>) => (
    <>
      {
        formItemsByType[schemeProps.type]({
          formGeneratorProps: formDataItemController,
          schemeProps: {...schemeProps, key: schemeProps.key},
          renderProps,
        })
      }
    </>
  ));
