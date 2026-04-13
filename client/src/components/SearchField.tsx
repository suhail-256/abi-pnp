// import { useRef } from 'react';
import { useChainId } from 'wagmi';
import abiService from '../services/abiService';
import { AbiSchema, AddressSchema, type Abi, type Address } from '../types/contract';
import { useContract } from '../context/ContractContext';
import { isAddress } from 'viem';
import { type ChangeEvent, useState } from 'react';

function SearchField() {
	const [inputValue, setInputValue] = useState('');
	const { setContractAddress, showFunctions, setShowFunctions } = useContract();

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		const address = e.target.value as Address;
		setInputValue(address);

		if (address.length !== 42) return;
		if (!isAddress(address)) {
			throw new Error('Invalid address format');
		}

		if (!showFunctions) {
			setContractAddress(address);
		}
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setContractAddress(inputValue as Address);
		setShowFunctions(true);
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<input value={inputValue} onChange={handleChange} type="text" placeholder="0x45586..." />
				<button type="submit">Submit</button>
			</form>
		</div>
	);
}

export default SearchField;
