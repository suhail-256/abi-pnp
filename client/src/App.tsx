import SearchField from './components/SearchField';
import FunctionsList from './components/FunctionsList';
import { useContract } from './context/ContractContext';
import ChainSelector from './components/ChainSelector';
import Connection from './components/Connection';

function App() {
	const { showFunctions } = useContract();
	return (
		<div>
			<Connection />
			<ChainSelector />
			<SearchField />
			{showFunctions && <FunctionsList />}
		</div>
	);
}

export default App;
