import SearchField from './components/SearchField';
import FunctionsList from './components/FunctionsList';
import { useContract } from './context/ContractContext';
import ChainSelector from './components/ChainSelector';
import Connection from './components/Connection';

function App() {
	const { showFunctions } = useContract();
	return (
		<div className="app-container">
			<div className="top-bar">
				<ChainSelector />
				<Connection />
			</div>
			<header className="hero">
				<h1 className="hero-title">ABI Plug & Play</h1>
				<div className="hero-search">
					<SearchField />
				</div>
			</header>
			{showFunctions && <FunctionsList />}
		</div>
	);
}

export default App;
