import { AbiParameter } from 'abitype';

interface PrimitiveInputProps {
  input: AbiParameter;
  index: number;
}

function PrimitiveInput({ input, index }: PrimitiveInputProps) {
  return (
    <div>
      <label>
        <span className="arg-title">{input.name || 'input'} </span>
        <span className="fn-params">({input.type})</span>
      </label>
      <input className="arg-input" type="text" placeholder={input.type} />
    </div>
  );
}

export default PrimitiveInput;
