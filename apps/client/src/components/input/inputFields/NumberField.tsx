import RegularField from './RegularField';
import { AbiParameter } from 'abitype';
import { ArgValue } from '../../../types/argValue';
import { useEffect, useState } from 'react';
import { isValidIntegerInput } from '../../../utils/inputValidation';

interface NumberFieldProps {
  input: AbiParameter;
  value: string;
  onChange: (values: ArgValue) => void;
}

export default function NumberField({ input, value, onChange }: NumberFieldProps) {
  const [displayError, setDisplayError] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);

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

  const handleNumberInputChange = (rawValue: string) => {
    if (isValidIntegerInput(rawValue)) {
      onChange(BigInt(rawValue));
    } else {
      setDisplayError('Invalid number');
    }
  };

  return (
    <div>
      <RegularField
        input={input}
        handleInputChange={handleNumberInputChange}
        value={value}
        onChange={onChange}
      />
      {displayError && (
        <div className={`error-box ${isExiting ? 'exiting' : ''}`}>
          <div className="error-alert search-error" role="alert">
            <span className="error-alert-icon" aria-hidden="true">
              !
            </span>
            <span>{displayError}</span>
          </div>
        </div>
      )}{' '}
    </div>
  );
}
