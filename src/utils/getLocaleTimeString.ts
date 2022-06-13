export const getLocaleTimeString = (date: Date) => {
  return new Date(date).toUTCString();
};
