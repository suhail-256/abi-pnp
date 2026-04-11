import { useState } from 'react';
import { type FunctionType } from '../schemas/function';
import ReadButton from './contracts/Readbutton';

// list of stateMutabilities that doesn't modify the state (view, pure)
const readStates = ['view', 'pure'];

enum State {
	READ = 'read',
	WRITE = 'write',
}
interface ParamsInputProps {
	inputs?: FunctionType['inputs'];
	args: string[];
	setArgs: React.Dispatch<React.SetStateAction<string[]>>;
}

function ParamsInput({ inputs, args, setArgs }: ParamsInputProps) {
	const handleChange = (index: number, value: string) => {
		const newArgs = [...args];
		newArgs[index] = value;
		setArgs(newArgs);
	};

	return inputs?.map((input, index) => {
		const paramName = input.name || `input`;
		return (
			<span key={index}>
				<br />
				<input
					type="text"
					placeholder={`${paramName} (${input.type})`}
					value={args[index] || ''}
					onChange={e => handleChange(index, e.target.value)}
				/>
			</span>
		);
	});
}

interface FunctionCardProps {
	func: FunctionType;
}

function FunctionCard({ func }: FunctionCardProps) {
	const { inputs, name, stateMutability } = func;
	const hasInputs = inputs && inputs.length > 0;
	const [args, setArgs] = useState<string[]>(new Array(inputs?.length || 0).fill(''));

	const state: State = readStates.includes(stateMutability) ? State.READ : State.WRITE;
	const color = state === State.READ ? '#2657c2' : '#d64c33';

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
				<ReadButton func={func} args={args} />
			</fieldset>
		</div>
	);
}

export default FunctionCard;
