import { AbiParameter } from 'abitype';

interface PrimitiveInputProps {
  input: AbiParameter;
}

function PrimitiveInput({ input }: PrimitiveInputProps) {
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
