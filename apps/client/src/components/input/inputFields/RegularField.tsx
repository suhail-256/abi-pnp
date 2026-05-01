import { AbiParameter } from 'abitype';
import { ArgValue } from '../../../types/argValue';

interface RegularFieldProps {
  input: AbiParameter;
  handleInputChange?: (e: string) => void;
  value: string;
  onChange: (values: ArgValue) => void;
}

export default function RegularField({
  input,
  handleInputChange,
  value,
  onChange,
}: RegularFieldProps) {
  const { type } = input;

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    if (type === 'string' || type === 'address') {
      onChange(rawValue);
      return;
    }

    // custom validation for number inputs
    handleInputChange?.(rawValue);
  };

  return (
    <div>
      <input
        className="arg-input"
        placeholder={type}
        value={value}
        onChange={handleOnChange}
      />
    </div>
  );
}
