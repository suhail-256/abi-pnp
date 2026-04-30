import { AbiParameter } from 'abitype';
import { type ArgValue } from '../../types/argValue';
import ArgsInput from './ArgsInput';
import { useEffect } from 'react';
import { generateValueStructure } from './ArrayInput';

interface TupleInputProps {
  input: AbiParameter;
  components: AbiParameter[];
  value: Record<string, ArgValue>;
  onChange: (value: Record<string, ArgValue>) => void;
}

function TupleInput({ input, components, value, onChange }: TupleInputProps) {
  const valuesArray: ArgValue[] = components.map(
    c => value[c.name ?? ''] ?? generateValueStructure(c.type),
  );

  useEffect(() => {
    handleChange(valuesArray);
  }, []);

  const handleChange = (newArray: ArgValue[]) => {
    const next: Record<string, ArgValue> = {};
    components.forEach((c, i) => {
      next[c.name ?? String(i)] = newArray[i];
    });
    onChange(next);
  };

  return (
    <div>
      <div>
        <span className="arg-title">{input.name || 'input'}</span>
        <span className="fn-params"> ({input.type})</span>
      </div>
      <div className="tuple-body">
        <div className="tuple-inputs">
          <ArgsInput inputs={components} values={valuesArray} onChange={handleChange} />
        </div>
      </div>
    </div>
  );
}

export default TupleInput;
