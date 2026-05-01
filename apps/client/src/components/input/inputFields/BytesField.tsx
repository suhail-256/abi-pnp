import { AbiParameter } from 'abitype';
import { type ArgValue } from '../../../types/argValue';
import { isHex, stringToHex, padHex, hexToBytes, size, hexToString } from 'viem';
import { useEffect, useState } from 'react';

interface BytesFieldProps {
  input: AbiParameter;
  value: string;
  onChange: (values: ArgValue) => void;
  setDisplayError: (error: string | null) => void;
}

export default function BytesField({
  input,
  value,
  onChange,
  setDisplayError,
}: BytesFieldProps) {
  const [inputValue, setInputValue] = useState('');

  const { type } = input;

  /**
   * Gets the byte size for a given type string
   * @param inputType the type string from the ABI, e.g. "bytes", "bytes32"
   * @returns the byte size if it's a fixed bytes type (e.g. "bytes32" returns 32), otherwise null for dynamic bytes
   */
  const getByteSize = (inputType: string): number | null => {
    const match: RegExpMatchArray | null = inputType.match(/bytes(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  };

  /**
   * Pads a hex string to the specified byte size if provided
   * @param hex the hex string to pad
   * @param byteSize the size to pad to, if null it won't pad
   * @returns the padded hex string
   */
  const padHexToByteSize = (hex: `0x${string}`, byteSize: number | null): `0x${string}` => {
    if (!byteSize) return hex;

    return padHex(hex, {
      size: byteSize,
      dir: 'right',
    });
  };

  /**
   * Removes trailing zeros from a hex string (useful for displaying fixed bytes as strings)
   * @param hex the hex string to remove padding from
   * @returns the hex string without trailing zeros
   */
  const removeHexPadding = (hex: `0x${string}`): `0x${string}` => {
    return hex.replace(/0+$/g, '') as `0x${string}`;
  };

  const handleBytesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    let hex: `0x${string}`;

    if (isHex(rawValue)) {
      hex = rawValue;
    } else {
      hex = stringToHex(rawValue.trim());
    }

    const byteSize: number | null = getByteSize(type);

    if (byteSize) {
      if (size(hex) > byteSize) {
        setDisplayError(`Input can not exceed byte size of ${byteSize}`);
        return;
      }

      setInputValue(rawValue);
      onChange(padHexToByteSize(hex, byteSize));

      return;
    }

    setInputValue(rawValue);
    onChange(hex);
  };

  const handleToggleView = () => {
    if (isHex(inputValue)) {
      const str = hexToString(removeHexPadding(inputValue)).trim();
      setInputValue(str);
    } else {
      const byteSize = getByteSize(type);
      const hex = stringToHex(inputValue.trim());
      if (size(hex) > (byteSize ?? Infinity)) {
        setDisplayError(`Input can not exceed byte size of ${byteSize}`);
        return;
      }
      const paddedHex = padHexToByteSize(hex, byteSize);
      setInputValue(paddedHex);
      if (paddedHex !== value) {
        onChange(paddedHex);
      }
    }
  };

  const isHexView = inputValue === '' ? false : isHex(inputValue);

  return (
    <>
      <div className="input-with-toggle">
        <input
          className="arg-input"
          type="text"
          placeholder={type}
          value={inputValue}
          onChange={handleBytesChange}
        />
        <div className="inline-toggle">
          <div className={`inline-toggle-slider ${isHexView ? 'is-right' : ''}`}></div>
          <button
            type="button"
            className={`inline-toggle-btn ${!isHexView ? 'active' : ''}`}
            onClick={() => isHexView && handleToggleView()}
          >
            Str
          </button>
          <button
            type="button"
            className={`inline-toggle-btn ${isHexView ? 'active' : ''}`}
            onClick={() => !isHexView && handleToggleView()}
          >
            Hex
          </button>
        </div>
      </div>
    </>
  );
}
