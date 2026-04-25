
import React from 'react';
import { AbiParameter } from 'abitype';

interface PrimitiveInputProps {
  input: AbiParameter;
  index: number;
}

function PrimitiveInput({ input, index }: PrimitiveInputProps) {
  const inputTitle = () => {
    if (index >= 0) {
      return (
        <>
          <span className="arg-title">
            {input.name || 'input'}[{index}]{' '}
          </span>
        </>
      );
    }

    return (
      <>
        <span className="arg-title">{input.name || 'input'} </span>
        <span className="fn-params">({input.type})</span>
      </>
    );
  };

  return (
    <div>
      <label>{inputTitle()}</label>
      <input className="arg-input" type="text" placeholder={input.type} />
    </div>
  );
}

export default PrimitiveInput;
