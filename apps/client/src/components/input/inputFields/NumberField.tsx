import RegularField from './RegularField';
import { AbiParameter } from 'abitype';
import { ArgValue } from '../../../types/argValue';
import { isValidIntegerInput } from '../../../utils/inputValidation';

interface NumberFieldProps {
  input: AbiParameter;
  value: string;
  onChange: (values: ArgValue) => void;
}

export default function NumberField({ input, value, onChange }: NumberFieldProps) {
  const handleNumberInputChange = (rawValue: string) => {
    if (!isValidIntegerInput(rawValue)) return;
    onChange(BigInt(rawValue));
  };

  return (
    <div>
      <RegularField
        input={input}
        handleInputChange={handleNumberInputChange}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
