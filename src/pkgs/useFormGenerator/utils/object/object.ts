
import {AnyRecord, RecordKey} from '../../types';
import {isObject, isUndefined} from '../check';
import {isNull} from '..';

type Key = string | number;

export const createRecord = (keys: Array<string>, createValue: () => any) => {
  return keys?.reduce((acc, key) => ({...acc, [key]: createValue()}), {});
};

export const objectGetValue = (obj: AnyRecord | undefined, keys: Array<string | undefined>) => {
  if (!isObject(obj)) {
    return;
  }

  const isValidKey = !keys.some((key) => isUndefined(key) && isNull(key));

  if (!isValidKey) {
    return;
  }

  return keys.reduce((acc: any, key: any, index) => {
    const lastIndex = keys.length - 1;
    if (index === lastIndex) {
      return acc[key];
    }

    return (acc[key] = {...acc[key]});
  }, obj);
};

export const objectKeys = (obj) => {
  if (obj) {
    return Object.keys(obj);
  }
};

export const objectNestedEntries = (obj: object) => {
  const returnValue: Array<[nestedKeys: string[], value: any]> = [];

  type TmpValue = [extractedNestedKeys: string[], value: Record<string, any>];
  for (const tmpValues: TmpValue[] = [[[], obj]]; tmpValues.length;) {
    const [tmpItemKeys, tmpItemValue] = tmpValues.pop() as TmpValue;

    tmpValues.push(
      ...Object.entries(tmpItemValue).reduce((acc: TmpValue[], [key, value]): TmpValue[] => {
        if (isObject(value)) {
          return [...acc, [[...tmpItemKeys, key], value]];
        }

        returnValue.push([[...tmpItemKeys, key], value]);

        return acc;
      }, []),
    );
  }

  return returnValue;
};

export const objectGetNestedKeys = (obj: object) => {
  if (!isObject(obj)) {
    return;
  }

  return Object.entries(obj).reduce((acc: string[], [key, value]) => {
    const nestedKeys = objectGetNestedKeys(value);

    if (!nestedKeys) {
      return [...acc, [key]];
    }

    return [...acc, ...nestedKeys.map((itemKeys) => [key, ...itemKeys])];
  }, []);
};

export const objectJoinNestedKeys = <O extends object>(
  obj: O,
  joinKeys: (keys: string[]) => string = (keys) => keys.join('.'),
): Record<string, any> => {
  return Object.fromEntries(
    objectNestedEntries(obj).map(([nestedKeys, value]) => {
      return [joinKeys(nestedKeys), value];
    }),
  );
};

export const objectToQueryString = (
  sourceObj: object,
  callback: ([string, any]) => string = ([key, value]) => `${key}=${encodeURIComponent(value)}`,
) => {
  return Object.entries(objectJoinNestedKeys(sourceObj))
    .reduce((acc: string[], entry) => [...acc, callback(entry)], [])
    .filter(Boolean)
    .join('&');
};

type NestedEntry = [keys: string[], value: any];
export const objectFromNestedEntries = (nestedEntry: NestedEntry[]) => {
  const returnValue = {};
  for (const [nestedKeys, value] of nestedEntry) {
    let refObj = returnValue;

    nestedKeys.forEach((key, keyIndex) => {
      const isLastInteraction = keyIndex + 1 === nestedKeys.length;
      if (isLastInteraction) {
        refObj[key] = value;
        return;
      }

      refObj[key] = {...refObj[key]};
      refObj = refObj[key];
    });
  }

  return returnValue;
};

type ObjectGroup = {
  [key: string]: (item: [key: (string | number) | any, value: any]) => boolean | undefined;
};
export const objectGrouping = (obj: Record<Key, any>, grouping: ObjectGroup) => {
  if (!isObject(obj) && !isObject(grouping)) {
    return;
  }

  const initialAcc = createRecord(
    Object.keys(grouping).map((key) => key),
    () => ({}),
  );

  return Object.entries(obj).reduce((acc, entryItem) => {
    Object.entries(grouping).forEach(([groupKey, groupPredicate]) => {
      if (groupPredicate(entryItem)) {
        acc[groupKey] = {...acc[groupKey], ...Object.fromEntries([entryItem])};
      }
    });

    return acc;
  }, initialAcc);
};

// Что бы нормализовать данные к виду {id: data}
export const normalizeData = (data): { [id: string]: any } => {
  return Object.fromEntries(data.map((item: object & { id: number }) => [item.id, item]));
};

type EnhanceDataProps = {
  sourceData: { id: number }[];
  enhancedData: Record<string, any>;
};
/**
 * Для обогащение данных
 */
export const enhanceSourceData = ({sourceData, enhancedData}: EnhanceDataProps) => {
  return sourceData.map(({id}) => enhancedData[id]);
};

export const objectFilter = <O extends AnyRecord>(
  obj: O,
  predicate: (item: [keyof O, O[keyof O]]) => boolean | any,
) => {
  return Object.fromEntries(Object.entries(obj).filter(predicate));
};

export const objectValues = <R extends AnyRecord>(obj?: R): undefined | Array<R[keyof R]> => {
  if (isUndefined(obj)) {
    return;
  }

  return Object.values(obj as NonNullable<typeof obj>);
};

export const parseQuery = (query: string) => {
  return Object.fromEntries(query.split('&').map((item) => item.split('=')));
};

export const objectMap = (
  object: AnyRecord,
  callbackfn: ([RecordKey, any]) => [RecordKey, any],
) => {
  return Object.fromEntries(Object.entries(object).map(callbackfn));
};

export const objectForEach = (object: AnyRecord, callbackfn: ([RecordKey, any]) => void) => {
  Object.entries(object).forEach(callbackfn);
};

export const objectChangeValueByKeys = (obj: AnyRecord, keys: RecordKey[], newValue: any) => {
  // Что бы не мутировать исходный объект
  // Меняет ссылку только для дерево связанного с проброшенном путём ключей
  const newObj = {...obj};
  let refNode = newObj;

  keys.forEach((key, index) => {
    if (index + 1 === keys.length) {
      refNode[key] = newValue;
      return;
    }

    refNode[key] = {...refNode[key]};
    refNode = refNode[key];
  });

  return newObj;
};
