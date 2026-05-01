/**
 * A recursive type that can represent any ABI argument value:
 *  - string          → a primitive (uint, address, bool, bytes, etc.)
 *  - ArgValue[]      → a fixed or dynamic array
 *  - Record<string, ArgValue> → a tuple (struct), keyed by field name
 */
export type ArgValue = string | boolean | bigint | ArgValue[] | Record<string, ArgValue>;
