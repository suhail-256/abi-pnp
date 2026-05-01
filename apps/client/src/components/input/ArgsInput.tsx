import { type AbiParameter } from '../../types/contract';
import ArrayInput from './ArrayInput';
import PrimitiveInput from './PrimitiveInput';
import TupleInput from './TupleInput';
import { ArgValue } from '../../types/argValue';
import ValueField from './inputFields/ValueField';

interface ArgsInputProps {
  inputs?: AbiParameter[];
  isPayable?: boolean;
  values: ArgValue[];
  onChange: (values: ArgValue[]) => void;
  payableValue?: bigint;
  setPayableValue?: (value: bigint) => void;
}

function ArgsInput({
  inputs,
  isPayable,
  values,
  onChange,
  payableValue,
  setPayableValue,
}: ArgsInputProps) {
  const handleChange = (idx: number, newValue: ArgValue) => {
    const updatedArgs = [...values];
    updatedArgs[idx] = newValue;
    onChange(updatedArgs);
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
              onChange={v => handleChange(index, v)}
            />
          );
        }
      })}
      {isPayable && (
        <ValueField
          input={{ name: 'value', type: 'value' }}
          value={payableValue!}
          onChange={v => setPayableValue?.(v as bigint)}
        />
      )}
    </>
  );
}

export default ArgsInput;
