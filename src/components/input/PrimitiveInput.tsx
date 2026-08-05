import { AbiParameter } from 'abitype';
import { type ArgValue } from '../../types';
import BytesField from './inputFields/BytesField';
import BoolField from './inputFields/BoolField';
import RegularField from './inputFields/RegularField';
import NumberField from './inputFields/NumberField';
import { memo } from 'react';

interface PrimitiveInputProps {
  input: AbiParameter;
  value: string;
  onChange: (values: ArgValue) => void;
}

function PrimitiveInput({ input, value, onChange }: PrimitiveInputProps) {
  const { type } = input;
  
  let inputField = <></>;

  // FIXME: include minus sign `-` for int types (except uint)
  if (type.includes('int')) {
    inputField = <NumberField input={input} value={value} onChange={onChange} />;
  } else if (type.startsWith('bytes')) {
    inputField = (
      <BytesField
        input={input}
        value={value}
        onChange={onChange}
      />
    );
  } else if (type === 'bool') {
    inputField = <BoolField input={input} value={value} onChange={onChange} />;
  } else {
    inputField = <RegularField input={input} value={value} onChange={onChange} />;
  }

  return (
    <div>
      <span>
        <label>
          <span className="arg-title">{input.name || 'input'} </span>
          <span className="fn-params">({input.type})</span>
        </label>
        {inputField}
      </span>
    </div>
  );
}

export default memo(PrimitiveInput);
