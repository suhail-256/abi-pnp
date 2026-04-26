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
          if ('components' in input && Array.isArray(input.components)) {
            return (
              <div key={index}>
                <>
                  <span className="tuple-title">{input.name || 'input'}</span>
                  <span className="fn-params">({input.type})</span>
                </>
                <div className="tuple-body">
                  <ArgsInput
                    inputs={input.components}
                    // inputIndex={index}
                    args={args}
                    setArgs={setArgs}
                    buttonRef={buttonRef}
                  />
                </div>
              </div>
            );
          }
          // Optionally handle the error case here
          return null;
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
