import { useState, useEffect } from 'react';
import { AbiParameter, type AbiFunction } from '../types/contract';
import { type ArgValue } from '../types/argValue';
import ReadButton from './contracts/ReadButton';
import ArgsInput from './input/ArgsInput';
import SendButton from './contracts/SendButton';
import ValueField from './input/inputFields/ValueField';

function generateArgsStructure(param: AbiParameter): ArgValue {
  const { type } = param;

  // Array
  if (type.endsWith(']')) {
    const openBracket = type.lastIndexOf('[');
    const closeBracket = type.lastIndexOf(']');
    const isDynamic = closeBracket - openBracket === 1;

    if (isDynamic) {
      // Dynamic: start with a single empty slot
      return [generateArgsStructure({ ...param, type: type.substring(0, openBracket) })];
    } else {
      // Fixed: pre-fill with the correct number of empty slots
      const length = parseInt(type.substring(openBracket + 1, closeBracket), 10);
      const elementType = type.substring(0, openBracket);
      return Array.from({ length }, () =>
        generateArgsStructure({ ...param, type: elementType }),
      );
    }
  }

  // Tuple
  else if (
    type.startsWith('tuple') &&
    'components' in param &&
    Array.isArray(param.components)
  ) {
    const record: Record<string, ArgValue> = {};
    (param.components as AbiParameter[]).forEach((c, i) => {
      record[c.name ?? String(i)] = generateArgsStructure(c);
    });
    return record;
  }

  // Primitive
  return '';
}

function initArgs(inputs: AbiParameter[]): ArgValue[] {
  return inputs.map(input => generateArgsStructure(input));
}

interface FunctionCardProps {
  fnInfo: AbiFunction;
}

enum State {
  READ = 'read',
  WRITE = 'write',
  PAYABLE = 'payable',
}

function FunctionCard({ fnInfo }: FunctionCardProps) {
  const { inputs, name, stateMutability } = fnInfo;

  const [functState, setFunctState] = useState<State>(State.READ);
  const [args, setArgs] = useState<ArgValue[]>(() => initArgs(inputs as AbiParameter[]));
  const [payableValue, setPayableValue] = useState<bigint | ''>('');
  const [hasInputs, setHasInputs] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setHasInputs(!!inputs?.length);
    let fnState: State;
    switch (stateMutability) {
      case 'view':
      case 'pure':
        fnState = State.READ;
        break;
      case 'payable':
        fnState = State.PAYABLE;
        break;
      default:
        fnState = State.WRITE;
    }
    console.log(fnState);

    setFunctState(fnState);
  }, []);

  return (
    <div className={`fn-card ${expanded ? 'fn-card--open' : ''}`}>
      <div className="fn-header" onClick={() => setExpanded(p => !p)}>
        <button type="button" className={`fn-name-btn fn-name-btn--${functState}`}>
          {name}
        </button>
        {hasInputs && (
          <span className="fn-params">
            (
            {inputs?.map((param, index) => (
              <span key={index}>
                {param.name || 'input'}
                {index < inputs.length - 1 ? ', ' : ''}
              </span>
            ))}
            )
          </span>
        )}
        <span className={`fn-chevron ${expanded ? 'fn-chevron--open' : ''}`}>
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
      <div className={`fn-body ${expanded ? 'fn-body--open' : ''}`}>
        <div className="fn-body-inner">
          {hasInputs && (
            <div className="fn-inputs">
              <ArgsInput inputs={inputs as AbiParameter[]} values={args} onChange={setArgs} />
            </div>
          )}
          {functState === State.PAYABLE && (
            <div className="fn-inputs">
              <ValueField
                input={{ name: 'value', type: 'value' }}
                value={payableValue!}
                onChange={v => setPayableValue(v as bigint)}
              />
            </div>
          )}
          <div className="fn-actions">
            {functState === State.READ && <ReadButton fn={fnInfo} args={args} />}
            {(functState === State.WRITE || functState === State.PAYABLE) && (
              <SendButton fn={fnInfo} args={args} payableValue={payableValue as bigint} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FunctionCard;
