import { type Address } from '../types/contract';
import { useContract } from '../context/ContractContext';
import { isAddress } from 'viem';
import { type ChangeEvent, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

function SearchField() {
	const [inputValue, setInputValue] = useState('');
	const { setContractAddress, showFunctions, setShowFunctions, AbiError } = useContract();
	const [displayError, setDisplayError] = useState<string | null>(null);
	const { selectedChainId } = useContract();
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!displayError) return;
			setShowFunctions(false);

		const timer = setTimeout(() => setDisplayError(null), 3000);
		return () => clearTimeout(timer);
	}, [displayError]);

	useEffect(() => {
		if (!AbiError) return;
		setDisplayError((AbiError as Error).message);
	}, [AbiError]);

	useEffect(() => {
		if (showFunctions) setDisplayError(null);
	}, [showFunctions]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const address = e.target.value as Address;
		setInputValue(address);

		if (isAddress(address) && !showFunctions) {
			setContractAddress(address);
		}
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!isAddress(inputValue)) {
			setDisplayError('Invalid address');
			return;
		}
		queryClient.removeQueries({ queryKey: ['abi', inputValue, selectedChainId] });
		setContractAddress(inputValue as Address);
		setShowFunctions(true);
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<input
					value={inputValue}
					onChange={handleChange}
					type="text"
					placeholder="0x45586..."
				/>
				<button type="submit">Submit</button>
			</form>
			{displayError && <p style={{ color: 'red' }}>{displayError}</p>}
		</div>
	);
}

export default SearchField;
