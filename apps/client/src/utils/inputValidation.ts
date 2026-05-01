/**
 * Validates if the input is a valid integer string
 * @param value the raw input string to validate
 * @returns true if the input is a valid integer string, false otherwise
 */
export const isValidIntegerInput = (value: string): boolean => {
  return value === '' || value === '-' || /^-?\d+$/.test(value);
};

/**
 * Validates if the input is a valid value string (either a valid number or empty)
 * @param value the raw input string to validate
 * @returns true if the input is a valid value string, false otherwise
 */
export const isValidWeiInput = (value: string): boolean => {
  // value with no negatives
  return /^\d+$/.test(value);
};

/**
 * Validates if the input is a valid value string (either a valid number or empty)
 * @param value the raw input string to validate
 * @returns true if the input is a valid value string, false otherwise
 */
export const isValidEtherInput = (value: string): boolean => {
  // value can have decimals but no negatives
  return /^\d*\.?\d*$/.test(value);
};
