import { useRef } from 'react';
import { useChainId } from 'wagmi';
import abiService from '../services/abiService';
import { AbiSchema, type Abi, type SolidityAddress } from '../types/contract';
import { useContract } from '../context/ContractContext';

interface SearchFieldProps {
	setContractAddress: (address: SolidityAddress) => void;
	setAbi: (abi: Abi) => void;
}

function SearchField() {
	const { setContractAddress } = useContract();
	const chainId = useChainId();

	const inputRef = useRef<HTMLInputElement>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const address = inputRef.current?.value as SolidityAddress | undefined;
		setContractAddress(address!);

		console.log(address);
		console.log(chainId);

		const fetchedAbi = await abiService.getAbi(chainId, address!);
		console.log(fetchedAbi);

		// validate abi using zod
		const parsedAbi = AbiSchema.safeParse(fetchedAbi);
		if (!parsedAbi.success) {
			console.error('Invalid ABI:', parsedAbi.error);
			return;
		}

	};

	return (
		<form onSubmit={handleSubmit}>
			<input ref={inputRef} type="text" placeholder="0x45586..." />
			<button type="submit">Submit</button>
		</form>
	);
}

export default SearchField;
