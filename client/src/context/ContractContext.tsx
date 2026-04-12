import { createContext, useContext, useState } from 'react';
import { AbiSchema, type Abi, type AbiFunction, type Address } from '../types/contract';
import { useQuery } from '@tanstack/react-query';
import abiService from '../services/abiService';
import { useChainId } from 'wagmi';

interface ContractContextType {
	contractAddress: Address | undefined;
	setContractAddress: (address: Address) => void;
	abi: Abi | undefined;
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
	functions: undefined,
	showFunctions: false,
	setShowFunctions: () => {},
	isLoading: false,
	error: null,
});

function ContractProvider({ children }: { children: React.ReactNode }) {
	const [contractAddress, setContractAddress] = useState<Address>();
	const [showFunctions, setShowFunctions] = useState(false);
	const chainId = useChainId();

	const extractFunctions = (abi: Abi): AbiFunction[] => {
		// console.log(abi.filter((item): item is FunctionType => item.type === 'function'));
		return abi.filter((item): item is AbiFunction => item.type === 'function');
	};

	const { data, isLoading, error } = useQuery({
		queryKey: ['abi', contractAddress, chainId],
		queryFn: async (): Promise<{ abi: Abi; functions: AbiFunction[] }> => {
			let fetchedAbi;
			try {
				fetchedAbi = await abiService.getAbi(chainId, contractAddress!);
			} catch (err) {
				setShowFunctions(false);
				return {
					abi: [],
					functions: [],
				};
			}

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
