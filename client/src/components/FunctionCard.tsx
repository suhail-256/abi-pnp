import { useState } from 'react';
import { type FunctionType } from '../schemas/function';
import ReadButton from './contracts/Readbutton';
import ParamsInput from './ParamsInput';

// list of stateMutabilities that doesn't modify the state (view, pure)
const readStates = ['view', 'pure'];

enum State {
	READ = 'read',
	WRITE = 'write',
}


interface FunctionCardProps {
	func: FunctionType;
}

function FunctionCard({ func }: FunctionCardProps) {
	const { inputs, name, stateMutability } = func;
	const hasInputs = inputs && inputs.length > 0;
	const [args, setArgs] = useState<string[]>(new Array(inputs?.length || 0));

	const functState: State = readStates.includes(stateMutability) ? State.READ : State.WRITE;
	const color = functState === State.READ ? '#2657c2' : '#d64c33';

	return (
		<div>
			<fieldset style={{ marginBottom: '16px' }}>
				<button style={{ backgroundColor: color }}>{name}</button> &nbsp;
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
				{hasInputs && <ParamsInput inputs={inputs} args={args} setArgs={setArgs} />}
				<br />
				{functState === State.READ && <ReadButton func={func} args={args} />}
				{/* {functState === State.WRITE && <WriteButton func={func} args={args} />} */}
			</fieldset>
		</div>
	);
}

export default FunctionCard;
