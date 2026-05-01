import { AbiParameter, SolidityAddress } from 'abitype';
import { type ArgValue } from '../../types/argValue';
// import { toBytes, stringToHex } from 'viem'
import { isHex, stringToHex, padHex, hexToBytes, size, hexToString } from 'viem';
import BytesField from './inputFields/BytesField';
import BoolField from './inputFields/BoolField';
import RegularField from './inputFields/RegularField';
import NumberField from './inputFields/NumberField';

interface PrimitiveInputProps {
  input: AbiParameter;
  value: string;
  onChange: (values: ArgValue) => void;
}

function PrimitiveInput({ input, value, onChange }: PrimitiveInputProps) {
  const { type } = input;

  let inputField = <></>;

  if (type.includes('int')) {
    inputField = <NumberField input={input} value={value} onChange={onChange} />;
  } else if (type.startsWith('bytes')) {
    inputField = <BytesField input={input} value={value} onChange={onChange} />;
  } else if (type === 'bool') {
    inputField = <BoolField input={input} value={value} onChange={onChange} />;
  } else {
    inputField = <RegularField input={input} value={value} onChange={onChange} />;
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
