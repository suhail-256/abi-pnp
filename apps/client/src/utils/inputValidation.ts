/**
 * Validates if the input is a valid integer string
 * @param value the raw input string to validate
 * @returns true if the input is a valid integer string, false otherwise
 */
export const isValidIntegerInput = (value: string): boolean => {
  return value === '' || value === '-' || /^-?\d+$/.test(value);
};


