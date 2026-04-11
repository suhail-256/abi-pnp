import { type FunctionType } from '../schemas/function';

// list of stateMutabilities that doesn't modify the state (view, pure)
const readStates = ['view', 'pure'];

enum State {
  READ = 'read',
  WRITE = 'write'
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
			<button style={{ backgroundColor: color }}>
				{name}
			</button> &nbsp;
			{hasInputs && '('}
			{inputs?.map((param, index) => {
				return (
					<span key={index}>
						{param.name}
						{index < inputs.length - 1 ? ', ' : ''}
					</span>
				);
			})}
			{hasInputs && ')'}
			<br />
			<br />
		</div>
	);
}

interface FunctionsListProps {
	functions: FunctionType[];
}

function FunctionsList({ functions }: FunctionsListProps) {
	return (
		<div>
			<h2>Functions</h2>
			{functions?.map((func, index) => (
				<FunctionCard key={index} func={func} />
			))}
		</div>
	);
}

export default FunctionsList;
