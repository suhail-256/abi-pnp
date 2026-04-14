import { createContext, useContext, useState } from 'react';
import { AbiSchema, type Abi, type AbiFunction, type Address } from '../types/contract';
import { useQuery } from '@tanstack/react-query';
import abiService from '../services/abiService';
import { useChains } from 'wagmi';

interface ContractContextType {
	contractAddress: Address | undefined;
	setContractAddress: (address: Address) => void;
	abi: Abi | undefined;
	selectedChainId: number;
	setSelectedChainId: (chainId: number) => void;
	functions: AbiFunction[] | undefined;
	showFunctions: boolean;
	setShowFunctions: (show: boolean) => void;
	isLoading: boolean;
	error: unknown;
}

export const ContractContext = createContext<ContractContextType>({
	contractAddress: undefined,
	setContractAddress: () => {},
	abi: undefined,
	selectedChainId: 0,
	setSelectedChainId: () => {},
	functions: undefined,
	showFunctions: false,
	setShowFunctions: () => {},
	isLoading: false,
	error: null,
});

function ContractProvider({ children }: { children: React.ReactNode }) {
	const [contractAddress, setContractAddress] = useState<Address>();
	const [showFunctions, setShowFunctions] = useState(false);
	const chains = useChains();
	const [selectedChainId, setSelectedChainId] = useState<number>(
		chains.find(c => c.name.toLowerCase() === 'sepolia')?.id ?? 1,
	); // default mainnet

	const extractFunctions = (abi: Abi): AbiFunction[] => {
		return abi.filter((item): item is AbiFunction => item.type === 'function');
	};

	const { data, isLoading, error } = useQuery({
		queryKey: ['abi', contractAddress, selectedChainId],
		queryFn: async (): Promise<{ abi: Abi; functions: AbiFunction[] }> => {
			let fetchedAbi;
			// try {
			fetchedAbi = await abiService.getAbi(selectedChainId, contractAddress!);
			// } catch (err) {
			// 	setShowFunctions(false);
			// 	return {
			// 		abi: [],
			// 		functions: [],
			// 	};
			// }

			const parsedAbi = AbiSchema.safeParse(fetchedAbi);
			if (!parsedAbi.success) {
				throw new Error(`Invalid ABI: ${parsedAbi.error}`);
			}
			console.log(parsedAbi.data);

			return {
				abi: parsedAbi.data,
				functions: extractFunctions(parsedAbi.data),
			};
		},
		enabled: !!contractAddress,
		retry: false,
	});

	return (
		<ContractContext.Provider
			value={{
				contractAddress,
				setContractAddress,
				abi: data?.abi,
				selectedChainId,
				setSelectedChainId,
				functions: data?.functions,
				showFunctions,
				setShowFunctions,
				isLoading,
				error,
			}}
		>
			{children}
		</ContractContext.Provider>
	);
}

export const useContract = () => useContext(ContractContext);
export default ContractProvider;
