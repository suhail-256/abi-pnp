import React, { useState, useEffect } from 'react';
import { AbiParameter } from '../../types/contract';
import PrimitiveInput from './PrimitiveInput';
import ArgsInput from './ArgsInput';

interface ArrayInputProps {
  input: AbiParameter;
  // value: string;
  // onChange: (index: number, value: string) => void;
  // onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}


function ArrayInput({ input }: ArrayInputProps) {
  // state array of fields that will be renderd as map
  const [fields, setFields] = React.useState<number[]>([0]);
  const [expanded, setExpanded] = useState(false);
  const [arrayLength, setArrayLength] = useState<number | null>(null);

  const addField = () => {
    setFields(prev => [...prev, prev.length]);
  };

  const removeField = () => {
    if (fields.length == 1) return;
    setFields(prev => prev.slice(0, -1));
  };

  useEffect(() => {
    // check if it's fixed array and extract the length
    const lengthMatch = input.type.match(/\[(\d*)\]/);

    if (!lengthMatch || !lengthMatch[1]) return;

    setArrayLength(parseInt(lengthMatch[1]));

    const newFields = Array.from({ length: parseInt(lengthMatch[1]) }, (_, i) => i);
    setFields(newFields);
  }, []);

  // function to remove one dimension from the array type, for example if the type is uint256[2][3] it will return uint256[3]
  const removeArrayDimension = (type: string): string => {
    if (!type) return type;

    const firstOpenBracketIndex = type.indexOf('[');
    const firstCloseBracketIndex = type.indexOf(']');

    return (
      type.substring(0, firstOpenBracketIndex) + type.substring(firstCloseBracketIndex + 1)
    );
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
              {fields.map(index => (
                <div key={index}>
                  <ArgsInput
                    inputs={[
                      {
                        ...input,
                        type: removeArrayDimension(input.type),
                        internalType: removeArrayDimension(input.internalType!),
                      },
                    ]}
                    inputIndex={index}
                    args={[]}
                    setArgs={() => {}}
                    // buttonRef={null}
                  />
                </div>
              ))}
            </div>
            {!arrayLength && (
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

// <label>
//   <span className="arr-params">{`${input.name}[${fieldIndex}]`} </span>
//   {/* <span className="arr-params">({input.type})</span> */}
// </label>
