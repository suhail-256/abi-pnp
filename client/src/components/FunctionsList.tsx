import { useContract } from '../context/ContractContext';
import FunctionCard  from './FunctionCard';


function FunctionsList() {
	const { showFunctions, functions } = useContract();

	return (
		<div>
			<h2>Functions</h2>
			{showFunctions && functions?.map((func, index) => (
				<FunctionCard key={index} func={func} />
			))}
		</div>
	);
}

export default FunctionsList;
