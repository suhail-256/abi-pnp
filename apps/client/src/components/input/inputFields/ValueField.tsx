// value field component for entering the amount of ether to send with a transaction
import { AbiParameter } from 'abitype';
import { type ArgValue } from '../../../types/argValue';
import { parseEther } from 'viem';
import { isValidEtherInput, isValidWeiInput } from '../../../utils/inputValidation';
import { useState } from 'react';

interface ValueFieldProps {
  input: AbiParameter;
  value: bigint | '';
  onChange: (values: ArgValue) => void;
}

export default function ValueField({ input, value, onChange }: ValueFieldProps) {
  const [inWei, setInWei] = useState(true);
  const [displayValue, setDisplayValue] = useState<string>(value.toString());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.trim();

    if (rawValue === '') {
      setDisplayValue(rawValue);
      onChange('');
      return;
    }

    if (inWei) {
      // Wei must be an integer
      if (!isValidWeiInput(rawValue)) return;
      onChange(BigInt(rawValue));
    } else {
      // Ether can have decimals
      if (!isValidEtherInput(rawValue)) return;
      onChange(parseEther(rawValue as `${number}`));
    }
    setDisplayValue(rawValue);
  };

  const handleToggleView = () => {
    if (!value && value !== 0n) {
      setInWei(!inWei);
      return;
    }

    if (inWei) {
      // Convert wei to ether
      const etherStr = (Number(value) / 1e18).toString();
      setDisplayValue(etherStr);
    } else {
      // Convert ether to wei
      setDisplayValue(value.toString());
    }
    setInWei(!inWei);
  };

  return (
    <div>
      <span>
        <label>
          <span className="arg-title">payable value </span>
          <span className="fn-params">(ether/wei)</span>
        </label>
      </span>
      <div className="input-with-toggle">
        <input
          className="arg-input"
          type="text"
          placeholder={`0 (${inWei ? 'wei' : 'ether'})`}
          value={displayValue}
          onChange={handleChange}
        />
        <div className="inline-toggle">
          <div className={`inline-toggle-slider ${inWei ? 'is-right' : ''}`}></div>
          <button
            type="button"
            className={`inline-toggle-btn ${!inWei ? 'active' : ''}`}
            onClick={() => inWei && handleToggleView()}
          >
            Ether
          </button>
          <button
            type="button"
            className={`inline-toggle-btn ${inWei ? 'active' : ''}`}
            onClick={() => !inWei && handleToggleView()}
          >
            Wei
          </button>
        </div>
      </div>
    </div>
  );
}
