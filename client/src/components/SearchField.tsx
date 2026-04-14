import { type Address } from '../types/contract';
import { useContract } from '../context/ContractContext';
import { isAddress } from 'viem';
import { type ChangeEvent, useEffect, useState } from 'react';

function SearchField() {
	const [inputValue, setInputValue] = useState('');
	const [addressError, setAddressError] = useState<string | null>(null);
	const { setContractAddress, showFunctions, setShowFunctions, error } = useContract();
	const [displayError, setDisplayError] = useState<string | null>(null);

	useEffect(() => {
		if (!error) return;
		setDisplayError((error as Error).message);
		const timer = setTimeout(() => setDisplayError(null), 5000);
		return () => clearTimeout(timer);
	}, [error]);

	useEffect(() => {
		if (!addressError) return;
		setDisplayError(addressError);
		const timer = setTimeout(() => {
			setDisplayError(null);
			setAddressError(null);
		}, 5000);
		return () => clearTimeout(timer);
	}, [addressError]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const address = e.target.value as Address;
		setInputValue(address);

		if (address.length !== 42) return;
		if (!isAddress(address)) {
			setAddressError('Invalid address');
			return;
		}

		if (!showFunctions) {
			setContractAddress(address);
		}
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!isAddress(inputValue)) {
			setAddressError('Invalid address');
			return;
		}

		setContractAddress(inputValue);
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
