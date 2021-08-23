export const arrayChangeByIndex = (array: any[], index: number, newValue: any) => {
  const newArrayInstance = [...array];
  newArrayInstance.splice(index, 1, newValue);

  return newArrayInstance;
};
