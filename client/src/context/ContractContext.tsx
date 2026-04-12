import { createContext, useContext, useState } from 'react';
import type { Abi, AbiFunction, SolidityAddress } from '../types/contract';
import { useQuery } from '@tanstack/react-query';
import abiService from '../services/abiService';
import { useChainId } from 'wagmi';

interface ContractContextType {
	contractAddress: SolidityAddress | undefined;
	setContractAddress: (address: SolidityAddress) => void;
	abi: Abi | undefined;
	functions: AbiFunction[] | undefined;
	isLoading: boolean;
	error: unknown;
}

export const ContractContext = createContext<ContractContextType>({
	contractAddress: undefined,
	setContractAddress: () => {},
	abi: undefined,
	functions: undefined,
	isLoading: false,
	error: null,
});

function ContractProvider({ children }: { children: React.ReactNode }) {
	const [contractAddress, setContractAddress] = useState<SolidityAddress>();

	const chainId = useChainId();

	const extractFunctions = (abi: Abi): AbiFunction[] => {
		// console.log(abi.filter((item): item is FunctionType => item.type === 'function'));
		return abi.filter((item): item is AbiFunction => item.type === 'function');
	};

	const { data, isLoading, error } = useQuery({
		queryKey: ['abi', contractAddress, chainId],
		queryFn: async (): Promise<{ abi: Abi; functions: AbiFunction[] }> => {
			const abi = await abiService.getAbi(chainId, contractAddress!);
			return {
				abi: abi as Abi,
				functions: extractFunctions(abi),
			};
		},
		enabled: !!contractAddress,
	});

	return (
		<ContractContext.Provider
			value={{
				contractAddress,
				setContractAddress,
				abi: data?.abi,
				functions: data?.functions,
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
