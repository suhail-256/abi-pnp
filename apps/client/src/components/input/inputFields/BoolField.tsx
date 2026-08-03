import { AbiParameter } from 'abitype';
import { type ArgValue } from '../../../types';
import { useEffect } from 'react';


interface BoolFieldProps {
  input: AbiParameter;
  value: string;
  onChange: (values: ArgValue) => void;
}

export default function BoolField({ input, value, onChange }: BoolFieldProps) {
  const { type } = input;
  const isTrue = String(value) === 'true';
  
  useEffect(() => {
    onChange(false);
  }, []);

  return (
    <div className="input-with-toggle">
      <input
        className="arg-input"
        type="text"
        placeholder={type}
        value={value || 'false'}
        readOnly
      />
      <div className="inline-toggle">
        <div className={`inline-toggle-slider ${!isTrue ? 'is-right' : ''}`}></div>
        <button
          type="button"
          className={`inline-toggle-btn ${isTrue ? 'active' : ''}`}
          onClick={() => onChange(true)}
        >
          True
        </button>
        <button
          type="button"
          className={`inline-toggle-btn ${!isTrue ? 'active' : ''}`}
          onClick={() => onChange(false)}
        >
          False
        </button>
      </div>
    </div>
  );
} 