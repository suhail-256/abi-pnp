import { useState, useEffect, memo, useMemo } from 'react';
import { AbiParameter } from '../../types/contract';
import ArgsInput from './ArgsInput';
import { type ArgValue } from '../../types/argValue';

export const generateValueStructure = (type: string): ArgValue => {
  // Array
  if (type.endsWith(']')) {
    const openBracket = type.lastIndexOf('[');
    const closeBracket = type.lastIndexOf(']');
    const isDyn = closeBracket - openBracket === 1;

    if (isDyn) {
      // Dynamic: start with a single empty slot
      return [generateValueStructure(type.substring(0, openBracket))];
    } else {
      // Fixed: pre-fill with the correct number of empty slots
      const length = parseInt(type.substring(openBracket + 1, closeBracket), 10);
      const elementType = type.substring(0, openBracket);
      return Array.from({ length }, () => generateValueStructure(elementType));
    }
  }

  // if tuple, return an empty object (the actual structure will be built in TupleInput based on the components)
  else if (type.startsWith('tuple')) {
    return {};
  }

  // Primitive
  return '';
};

interface ArrayInputProps {
  input: AbiParameter;
  value: ArgValue[];
  onChange: (values: ArgValue[]) => void;
}

const stripLastDimension = (type: string): string => type.substring(0, type.lastIndexOf('['));

function ArrayInput({ input, value, onChange }: ArrayInputProps) {
  const [expanded, setExpanded] = useState(false);

  const isDynamic = useMemo(() => {
    const openBracket = input.type.lastIndexOf('[');
    const closeBracket = input.type.lastIndexOf(']');
    return closeBracket - openBracket === 1;
  }, [input.type]);

  // Memoized per-slot AbiParameters
  const slotInputs = useMemo(() => {
    const strippedType = stripLastDimension(input.type);
    const strippedInternalType = input.internalType
      ? stripLastDimension(input.internalType)
      : undefined;

    return Array.from({ length: value.length }, (_, slotIndex) => ({
      ...input,
      name: `${input.name ?? 'item'}[${slotIndex}]`,
      type: strippedType,
      internalType: strippedInternalType,
    }));
  }, [input, value.length]);

  const addField = () => {
    const strippedInputType = stripLastDimension(input.type);
    const newFieldValue = generateValueStructure(strippedInputType);
    onChange([...value, newFieldValue]);
  };

  const removeField = () => {
    if (value.length === 1) return;
    onChange(value.slice(0, -1));
  };

  const handleSlotChange = (slotIndex: number, newSlotValue: ArgValue) => {
    const next = value.slice();
    next[slotIndex] = newSlotValue;
    onChange(next);
  };

  return (
    <div>
      <label>
        <span className="arg-title">{input.name || 'input'} </span>
        <span className="fn-params">({input.type})</span>
      </label>
      <div className={`wrapper-card ${expanded ? 'wrapper-card--open' : ''}`}>
        <div className="wrapper-header" onClick={() => setExpanded(prev => !prev)}>
          <span className="wrapper-params">{input.internalType}</span>
          <span className={`wrapper-chevron ${expanded ? 'wrapper-chevron--open' : ''}`}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M3 4.5L6 7.5L9 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
        <div className={`wrapper-body ${expanded ? 'wrapper-body--open' : ''}`}>
          <div className="wrapper-body-inner">
            <div className="wrapper-inputs">
              {value.map((item, index) => (
                <div key={index}>
                  <ArgsInput
                    inputs={[slotInputs[index]]}
                    values={[item]}
                    onChange={([newSlotValue]) => handleSlotChange(index, newSlotValue)}
                  />
                </div>
              ))}
            </div>
            {isDynamic && (
              <div className="wrapper-actions">
                <button type="button" className="btn btn--add-field" onClick={addField}>
                  +
                </button>
                <button type="button" className="btn btn--remove-field" onClick={removeField}>
                  -
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ArrayInput);
