import { type Address } from '../types/contract';
import { useContract } from '../context/ContractContext';
import { isAddress } from 'viem';
import { type ChangeEvent, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import abiService from '../services/abiService';

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

	const checkIfContract = async (address: Address) => {
		try {
			const isContract = await abiService.isContract(selectedChainId, address);
			if (!isContract) {
				setDisplayError('No contract found at this address');
				return false;
			}
		} catch (err) {
			setDisplayError((err as Error).message);
			return false;
		}
		return true;
	};

	const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const address = e.target.value as Address;
		setInputValue(address);

		if (isAddress(address)) {
			const isContract = await checkIfContract(address);
			if (!isContract) return;

			if (!showFunctions) {
				setContractAddress(address);
			}
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!isAddress(inputValue)) {
			setDisplayError('Invalid address');
			return;
		}
		queryClient.removeQueries({ queryKey: ['abi', inputValue, selectedChainId] });

		const isContract = await checkIfContract(inputValue as Address);
		if (!isContract) return;

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
