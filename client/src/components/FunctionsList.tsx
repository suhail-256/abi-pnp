import { useContract } from '../context/ContractContext';
import FunctionCard from './FunctionCard';

function FunctionsList() {
	const { functions } = useContract();

	return (
		<div>
			<br/>
			{functions?.map((func, index) => (
				<FunctionCard key={index} func={func} />
			))}
		</div>
	);
}

export default FunctionsList;
