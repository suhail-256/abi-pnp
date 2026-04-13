import { useState, useRef, useEffect } from 'react';
import { type AbiFunction } from '../types/contract';
import ReadButton from './contracts/Readbutton';
import ArgsInput from './ArgsInput';

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
	const [buttonColor, setButtonColor] = useState<string>('#2657c2');
	const [args, setArgs] = useState<string[]>(new Array(inputs?.length || 0));
	const [hasInputs, setHasInputs] = useState<boolean>(false);

	const buttonRef = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
		setHasInputs(!!inputs?.length);
		if (readStates.includes(stateMutability)) {
			setFunctState(State.READ);
			setButtonColor('#2657c2');
		} else {
			setFunctState(State.WRITE);
			setButtonColor('#d64c33');
		}
	}, []);

	return (
		<div>
			<fieldset style={{ marginBottom: '16px' }}>
				<button type="button" style={{ backgroundColor: buttonColor }}>{name}</button> &nbsp;
				{hasInputs && '('}
				{inputs?.map((param, index) => {
					return (
						<span key={index}>
							{param.name ? param.name : 'input'}
							{index < inputs.length - 1 ? ', ' : ''}
						</span>
					);
				})}
				{hasInputs && ')'}
				{hasInputs && <ArgsInput inputs={inputs as any} args={args} setArgs={setArgs} buttonRef={buttonRef} />}
				<br />
				{functState === State.READ && <ReadButton func={func} args={args} buttonRef={buttonRef} />}
				{/* {functState === State.WRITE && <ReadButton func={func} args={args} buttonRef={buttonRef} />} */}
				{/* {functState === State.WRITE && <WriteButton func={func} args={args} />} */}
			</fieldset>
		</div>
	);
}

export default FunctionCard;
