// Formats the given number to a string with commas.
export const formatNumber = (num: number) =>
  formatNumericString(num.toString());

// Formats a numeric string to add commas.
export const formatNumericString = (text: string) =>
  text.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// Calculates the number of distinct rows based on the distinct as the api provides and the total number of rows, also checking if positive.
export const calculateDistinctRows = (
  totalRows: number,
  distinct: number
): number => {
  if (distinct > 0) {
    return distinct;
  }
  return -1 * distinct * totalRows;
};
