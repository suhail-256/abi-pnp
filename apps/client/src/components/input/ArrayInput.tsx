import { useState, useEffect } from 'react';
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

function ArrayInput({ input, value, onChange }: ArrayInputProps) {
  const [isDynamic, setIsDynamic] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Determine if the array is dynamic (e.g., uint256[]) or fixed (e.g., uint256[3]) on mount
  useEffect(() => {
    const openBracket = input.type.lastIndexOf('[');
    const closeBracket = input.type.lastIndexOf(']');
    setIsDynamic(closeBracket - openBracket === 1);
  }, []);

  /**
   * Removes one dimension from the array type string. For example, converts 'uint256[2][3][4]' to 'uint256[2][3]'.
   * It handles both fixed-length (e.g., [2]) and dynamic-length (e.g., []) arrays.
   */
  const stripLastDimension = (type: string): string =>
    type.substring(0, type.lastIndexOf('['));

  const addField = () => {
    const strippedInputType = stripLastDimension(input.type);
    const newFieldValue = generateValueStructure(strippedInputType);
    onChange([...value, newFieldValue]);
  };

  const removeField = () => {
    if (value.length === 1) return;
    onChange(value.slice(0, -1));
  };

  /**
   * Builds a synthetic AbiParameter for one slot of the array.
   * e.g. for input `balances uint256[3]`, slot 1 becomes `balances[1] uint256`.
   */
  const slotInput = (slotIndex: number): AbiParameter => ({
    ...input,
    name: `${input.name ?? 'item'}[${slotIndex}]`,
    type: stripLastDimension(input.type),
    internalType: input.internalType ? stripLastDimension(input.internalType) : undefined,
  });

  const handleSlotChange = (slotIndex: number, newSlotValue: ArgValue) => {
    const next = [...value];
    next[slotIndex] = newSlotValue;
    onChange(next);
  };

  return (
    <div>
      <label>
        <span className="arg-title">{input.name || 'input'} </span>
        <span className="fn-params">({input.type})</span>
      </label>
      <div className={`arr-card ${expanded ? 'arr-card--open' : ''}`}>
        <div className="arr-header" onClick={() => setExpanded(prev => !prev)}>
          <span className="arr-params">{input.internalType}</span>
          <span className={`arr-chevron ${expanded ? 'arr-chevron--open' : ''}`}>
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
        <div className={`arr-body ${expanded ? 'arr-body--open' : ''}`}>
          <div className="arr-body-inner">
            <div className="arr-inputs">
              {value.map((item, index) => (
                <div key={index}>
                  <ArgsInput
                    inputs={[slotInput(index)]}
                    values={[item]}
                    onChange={([newSlotValue]) => handleSlotChange(index, newSlotValue)}
                    // buttonRef={null}
                  />
                </div>
              ))}
            </div>
            {isDynamic && (
              <div className="arr-actions">
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

export default ArrayInput;
