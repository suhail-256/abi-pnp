import React from 'react';
import { AbiFunction, type AbiParameter } from '../../types/contract';
import ArrayInput from './Array';
import PrimitiveInput from './PrimitiveInput';

interface ArgsInputProps {
  inputs?: AbiParameter[];
  inputIndex?: number;
  args: string[];
  setArgs: React.Dispatch<React.SetStateAction<string[]>>;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

function ArgsInput({ inputs, inputIndex = -1, args, setArgs, buttonRef }: ArgsInputProps) {
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
          return <> </>;
        }
        //* Primitive
        else {
          return <PrimitiveInput key={index} input={input} index={inputIndex} />;
        }
      })}
    </>
  );
}

export default ArgsInput;
