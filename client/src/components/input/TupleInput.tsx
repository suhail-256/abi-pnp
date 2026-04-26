import { AbiParameter } from 'abitype';
import ArgsInput from './ArgsInput';

interface TupleInputProps {
  input: AbiParameter;
  components: AbiParameter[];
}

function TupleInput({ input, components }: TupleInputProps) {
  return (
    <div>
      <>
        <span className="arg-title">{input.name || 'input'}</span>
        <span className="fn-params"> ({input.type})</span>
      </>
      <div className="tuple-body">
        <div className="tuple-inputs">
          <ArgsInput
            inputs={components}
            // inputIndex={index}
            args={[]}
            setArgs={() => {}}
            // buttonRef={null}
          />
        </div>
      </div>
    </div>
  );
}

export default TupleInput;
