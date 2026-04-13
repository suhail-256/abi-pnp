// drop down list of all the chains, get the chains using useChains fro mwagmi

import { useChains } from 'wagmi';
import { useContract } from '../context/ContractContext';

function ChainSelector() {
	const chains = useChains();
  const { selectedChainId, setSelectedChainId } = useContract();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChainId(Number(e.target.value));
    console.log(`Chain: ${Number(e.target.value)}`);
  }

	return (
		<select value={selectedChainId} onChange={handleChange}>
			{chains.map(chain => (
				<option key={chain.id} value={chain.id}>
					{chain.name}
				</option>
			))}
		</select>
	);
}

export default ChainSelector;
