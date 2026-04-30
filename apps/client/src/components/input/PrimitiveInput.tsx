import { AbiParameter } from 'abitype';

interface PrimitiveInputProps {
  input: AbiParameter;
  value: string;
  onChange: (values: string) => void;
}

function PrimitiveInput({ input, value, onChange }: PrimitiveInputProps) {
  return (
    <div>
      <label>
        <span className="arg-title">{input.name || 'input'} </span>
        <span className="fn-params">({input.type})</span>
      </label>
      <input
        className="arg-input"
        type="text"
        placeholder={input.type}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

export default PrimitiveInput;
