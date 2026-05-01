import { AbiParameter, SolidityAddress } from 'abitype';
import { type ArgValue } from '../../types/argValue';
// import { toBytes, stringToHex } from 'viem'
import { isHex, stringToHex, padHex, hexToBytes, size, hexToString } from 'viem';
import BytesField from './inputFields/BytesField';
import BoolField from './inputFields/BoolField';
import RegularField from './inputFields/RegularField';
import NumberField from './inputFields/NumberField';
import { useEffect, useState } from 'react';

interface PrimitiveInputProps {
  input: AbiParameter;
  value: string;
  onChange: (values: ArgValue) => void;
}

function PrimitiveInput({ input, value, onChange }: PrimitiveInputProps) {
  const [displayError, setDisplayError] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const { type } = input;

  useEffect(() => {
    if (!displayError) return;

    let exitTimer: any;

    const hideTimer = setTimeout(() => {
      setIsExiting(true);
      exitTimer = setTimeout(() => {
        setDisplayError(null);
        setIsExiting(false);
      }, 300);
    }, 2700);

    return () => {
      clearTimeout(hideTimer);
      if (exitTimer) clearTimeout(exitTimer);
      setIsExiting(false);
    };
  }, [displayError]);

  let inputField = <></>;

  if (type.includes('int')) {
    inputField = <NumberField input={input} value={value} onChange={onChange} />;
  } else if (type.startsWith('bytes')) {
    inputField = (
      <BytesField
        input={input}
        value={value}
        onChange={onChange}
        setDisplayError={setDisplayError}
      />
    );
  } else if (type === 'bool') {
    inputField = <BoolField input={input} value={value} onChange={onChange} />;
  } else {
    inputField = <RegularField input={input} value={value} onChange={onChange} />;
  }

  return (
    <div>
      <span>
        <label>
          <span className="arg-title">{input.name || 'input'} </span>
          <span className="fn-params">({input.type})</span>
        </label>
        {inputField}
      </span>
      {displayError && (
        <div className={`error-box ${isExiting ? 'exiting' : ''}`}>
          <div className="error-alert search-error" role="alert">
            <span className="error-alert-icon" aria-hidden="true">
              !
            </span>
            <span>{displayError}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default PrimitiveInput;
