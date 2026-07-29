import { type AbiParameter } from '../../types/contract';
import ArrayInput from './ArrayInput';
import PrimitiveInput from './PrimitiveInput';
import TupleInput from './TupleInput';
import { ArgValue } from '../../types/argValue';
import { useCallback, useEffect, useMemo, useRef } from 'react';

interface ArgsInputProps {
  inputs?: AbiParameter[];
  values: ArgValue[];
  onChange: (values: ArgValue[]) => void;
}

const EMPTY_ARRAY: ArgValue[] = [];
const EMPTY_OBJECT: Record<string, ArgValue> = {};

const isArrayType = (type: string): boolean => type.endsWith(']');

function ArgsInput({ inputs, values, onChange }: ArgsInputProps) {
  if (!inputs) throw new Error('Inputs undefined');

  const latest = useRef({ values, onChange });
  useEffect(() => {
    latest.current = { values, onChange };
  });

  const handleChange = useCallback((idx: number, newValue: ArgValue) => {
    const { values: currentValues, onChange: currentOnChange } = latest.current;
    const updated = currentValues.slice();
    updated[idx] = newValue;
    currentOnChange(updated);
  }, []);

  const handlers = useMemo(
    () => inputs.map((_, idx) => (v: ArgValue) => handleChange(idx, v)),
    [inputs.length, handleChange],
  );

  return (
    <>
      {inputs.map((input, index) => {
        const { type } = input;

        //* Array
        if (isArrayType(type)) {
          return (
            <ArrayInput
              key={index}
              input={input}
              value={(values[index] as ArgValue[]) ?? EMPTY_ARRAY}
              onChange={handlers[index]}
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
              value={(values[index] as Record<string, ArgValue>) ?? EMPTY_OBJECT}
              onChange={handlers[index]}
            />
          );
        }
        //* Primitive
        else {
          return (
            <PrimitiveInput
              key={index}
              input={input}
              value={(values[index] as string) ?? ''}
              onChange={handlers[index]}
            />
          );
        }
      })}
    </>
  );
}

export default ArgsInput;
