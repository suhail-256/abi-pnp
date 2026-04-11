import { type FunctionType } from '../schemas/function';

// list of stateMutabilities that doesn't modify the state (view, pure)
const readStates = ['view', 'pure'];

enum State {
	READ = 'read',
	WRITE = 'write',
}
interface ParamsInputProps {
	inputs?: FunctionType['inputs'];
}

function ParamsInput({ inputs }: ParamsInputProps) {
	return (
		<>
			{inputs?.map(
				(input, index) => (
					(input.name = input.name || `input`),
					(
						<div key={index}>
							<input type="text" placeholder={`${input.name} (${input.type})`} />
						</div>
					)
				),
			)}
		</>
	);
}

interface FunctionCardProps {
	func: FunctionType;
}

function FunctionCard({ func }: FunctionCardProps) {
	const { inputs, name, stateMutability } = func;
	const hasInputs = inputs && inputs.length > 0;
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
				{hasInputs && <ParamsInput inputs={inputs} />}
			</fieldset>
		</div>
	);
}

export default FunctionCard;
