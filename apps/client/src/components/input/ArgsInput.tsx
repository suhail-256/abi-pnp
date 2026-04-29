import React from 'react';
import { type AbiParameter } from '../../types/contract';
import ArrayInput from './ArrayInput';
import PrimitiveInput from './PrimitiveInput';
import TupleInput from './TupleInput';

interface ArgsInputProps {
  inputs?: AbiParameter[];
  args: string[];
  setArgs: React.Dispatch<React.SetStateAction<string[]>>;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

function ArgsInput({ inputs, args, setArgs, buttonRef }: ArgsInputProps) {
  const handleChange = (idx: number, value: string) => {
    const newArgs = [...args];
    newArgs[idx] = value;
    setArgs(newArgs);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      buttonRef?.current?.click();
    }
  };

  const isArray = (type: string): boolean => {
    return type.endsWith(']');
  };

  return (
    <>
      {inputs?.map((input, index) => {
        const type = input.type;
        //* Array
        if (isArray(type)) {
          return (
            <ArrayInput
              key={index}
              input={input}
              // value={args[index] || ''}
              // onChange={handleChange}
              // onKeyDown={handleKeyDown}
            />
          );
        }
        //* Tuple
        else if (type.startsWith('tuple')) {
          if ('components' in input && Array.isArray(input.components)) {
            return <TupleInput key={index} input={input} components={input.components} />;
          }
        }
        //* Primitive
        else {
          return <PrimitiveInput key={index} input={input} />;
        }
      })}
    </>
  );
}

export default ArgsInput;
