export const arrayChangeByIndex = (array: any[], index: number, newValue: any) => {
  const newArrayInstance = [...array];
  newArrayInstance.splice(index, index, newValue);

  return newArrayInstance;
};
