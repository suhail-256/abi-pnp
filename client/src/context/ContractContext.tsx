import { createContext, useContext, useState } from 'react';
import { Abi } from '../schemas/abi';
import { FunctionType } from '../schemas/function';
import { useQuery } from '@tanstack/react-query';
import abiService from '../services/abiService';
import { useChainId } from 'wagmi';

interface ContractContextType {
	contractAddress: string | undefined;
	setContractAddress: (address: string) => void;
	abi: Abi | undefined;
	functions: FunctionType[] | undefined;
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
	const [contractAddress, setContractAddress] = useState<string>();

	const chainId = useChainId();

	const extractFunctions = (abi: Abi): FunctionType[] => {
		// console.log(abi.filter((item): item is FunctionType => item.type === 'function'));
		return abi.filter((item): item is FunctionType => item.type === 'function');
	};

	const { data, isLoading, error } = useQuery({
		queryKey: ['abi', contractAddress, chainId],
		queryFn: async (): Promise<{ abi: Abi; functions: FunctionType[] }> => {
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
