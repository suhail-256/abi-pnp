import { AbiParameter, SolidityAddress } from 'abitype';
import { type ArgValue } from '../../types/argValue';
// import { toBytes, stringToHex } from 'viem'
import { isHex, stringToHex, padHex, hexToBytes, size, hexToString } from 'viem';
import BytesField from './inputFields/BytesField';
import BoolField from './inputFields/BoolField';

interface PrimitiveInputProps {
  input: AbiParameter;
  value: string;
  onChange: (values: ArgValue) => void;
}

function PrimitiveInput({ input, value, onChange }: PrimitiveInputProps) {
  const { type } = input;

  const castInputValue = (rawInputString: string): ArgValue => {
    if (type.startsWith('uint') || type.startsWith('int')) {
      return BigInt(rawInputString);
    }
    if (type === 'address') {
      return rawInputString as SolidityAddress;
    }
    if (type === 'bool') {
      return rawInputString.toLowerCase() === 'true';
    }
    if (type.startsWith('bytes')) {
      const match: RegExpMatchArray | null = rawInputString.match(/bytes(\d+)/);
      const byteSize: number | null = match ? parseInt(match[1], 10) : null;

      let hex: `0x${string}`;

      if (isHex(value)) {
        // User gave "0x123..."
        hex = value;
      } else {
        // User gave plain text "hello", convert to "0x68656c6c6f"
        hex = stringToHex(value);
      }

      if (byteSize) {
        const currentSize = size(hex);
        if (currentSize > byteSize) {
          throw new Error(`Input exceeds byte size of ${byteSize}`);
        }
        return padHex(stringToHex(rawInputString), {
          size: byteSize,
          dir: 'right',
        });
      }

      return hex;
    }

    return rawInputString;
  };


  let inputField = <></>;

  if (type.includes('int')) {
    // TODO: handle number inputs
  } else if (type.startsWith('bytes')) {
    inputField = (
      <BytesField input={input} value={value} onChange={onChange} />
    );
  } else if (type === 'bool') {
    inputField = (
      <BoolField input={input} value={value} onChange={onChange} />
    );
  } else { 
    inputField = (
      <input
        className="arg-input"
        type="text"
        placeholder={type}
        value={value}
        onChange={e => onChange(castInputValue(e.target.value))}
      />
    );
  }

  return (
    <span>
      <label>
        <span className="arg-title">{input.name || 'input'} </span>
        <span className="fn-params">({input.type})</span>
      </label>
      {inputField}
    </span>
  );

}

export default PrimitiveInput;
