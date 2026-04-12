import React from 'react';
import { type FunctionType } from '../schemas/function';

interface ParamsInputProps {
  inputs?: FunctionType['inputs'];
  args: string[];
  setArgs: React.Dispatch<React.SetStateAction<string[]>>;
}

function ParamsInput({ inputs, args, setArgs }: ParamsInputProps) {
  const handleChange = (index: number, value: string) => {
    if (!value.length) return;

    const newArgs = [...args];
    // if (inputs[index].type.includes('[]')) {
    //   // for array type, split by comma and trim spaces
    //   newArgs[index] = value.split(',').map(item => item.trim());
    // }
    newArgs[index] = value;
    setArgs(newArgs);
    console.log(newArgs);
    
  };

  return inputs?.map((input, index) => {
    const paramName = input.name || `input`;
    return (
      <span key={index}>
        <br />
        <input
          type="text"
          placeholder={`${paramName} (${input.type})`}
          value={args[index] || ''}
          onChange={e => handleChange(index, e.target.value)}
        />
      </span>
    );
  });
}

export default ParamsInput;