import React from 'react';
import { type AbiParameter } from '../../types/contract';
import ArrayInput from './ArrayInput';
import PrimitiveInput from './PrimitiveInput';
import TupleInput from './TupleInput';
import { ArgValue } from '../../types/argValue';

interface ArgsInputProps {
  inputs?: AbiParameter[];
  values: ArgValue[];
  onChange: (values: ArgValue[]) => void;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

function ArgsInput({ inputs, values, onChange, buttonRef }: ArgsInputProps) {
  const handleChange = (idx: number, newValue: ArgValue) => {
    const updatedArgs = [...values];
    updatedArgs[idx] = newValue;
    onChange(updatedArgs);
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
        const { type } = input;

        //* Array
        if (isArray(type)) {
          return (
            <ArrayInput
              key={index}
              input={input}
              value={(values[index] || []) as ArgValue[]}
              onChange={(v: ArgValue) => handleChange(index, v)}
              // onKeyDown={handleKeyDown}
            />
          );
        }
        //* Tuple
        else if (
          type.startsWith('tuple') &&
          'components' in input &&
          Array.isArray(input.components)
        ) {
          return (
            <TupleInput
              key={index}
              input={input}
              components={input.components}
              value={(values[index] || {}) as Record<string, ArgValue>}
              onChange={v => handleChange(index, v)}
            />
          );
        }
        //* Primitive
        else {
          return (
            <PrimitiveInput
              key={index}
              input={input}
              value={(values[index] || '') as string}
              onChange={(v) => handleChange(index, v)}
            />
          );
        }
      })}
    </>
  );
}

export default ArgsInput;
