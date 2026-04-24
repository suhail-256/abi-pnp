import { useState, useRef, useEffect } from 'react';
import { AbiParameter, type AbiFunction } from '../types/contract';
import ReadButton from './contracts/Readbutton';
import ArgsInput from './ArgsInput';
import WriteButton from './contracts/WriteContract';

interface FunctionCardProps {
  func: AbiFunction;
}

function FunctionCard({ func }: FunctionCardProps) {
  // list of stateMutabilities that doesn't modify the state (view, pure)
  const readStates = ['view', 'pure'];

  enum State {
    READ = 'read',
    WRITE = 'write',
  }

  const { inputs, name, stateMutability } = func;

  const [functState, setFunctState] = useState<State>(State.READ);
  const [args, setArgs] = useState<string[]>(new Array(inputs?.length || 0));
  const [hasInputs, setHasInputs] = useState<boolean>(false);
  const [expanded, setExpanded] = useState(false);

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setHasInputs(!!inputs?.length);
    if (readStates.includes(stateMutability)) {
      setFunctState(State.READ);
    } else {
      setFunctState(State.WRITE);
    }
  }, []);

  const isArray = (type: string): boolean => {
    return type.endsWith(']');
  }

  return (
    <div className={`fn-card ${expanded ? 'fn-card--open' : ''}`}>
      <div className="fn-header" onClick={() => setExpanded(prev => !prev)}>
        <button
          type="button"
          className={`fn-name-btn ${functState === State.READ ? 'fn-name-btn--read' : 'fn-name-btn--write'}`}
        >
          {name}
        </button>
        {hasInputs && (
          <span className="fn-params">
            (
            {inputs?.map((param, index) => (
              <span key={index}>
                {param.name ? param.name : 'input'}
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
              <ArgsInput
                inputs={inputs as AbiParameter[]}
                args={args}
                setArgs={setArgs}
                buttonRef={buttonRef}
              />
            </div>
          )}
          <div className="fn-actions">
            {functState === State.READ && (
              <ReadButton func={func} args={args} buttonRef={buttonRef} />
            )}
            {functState === State.WRITE && (
              <WriteButton func={func} args={args} buttonRef={buttonRef} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FunctionCard;
