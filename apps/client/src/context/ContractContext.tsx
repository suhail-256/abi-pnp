import { createContext, useContext, useState } from 'react';
import { AbiSchema, type Abi, type AbiFunction, type Address } from '../types/contract';
import { useQuery } from '@tanstack/react-query';
import contractService from '../services/contractService';

interface ContractContextType {
  contractAddress: Address | undefined;
  setContractAddress: (address: Address) => void;
  contractSource: string | undefined;
  abi: Abi | undefined;
  selectedChainId: number;
  setSelectedChainId: (chainId: number) => void;
  contractFunctions: AbiFunction[] | undefined;
  showFunctions: boolean;
  setShowFunctions: (show: boolean) => void;
  isLoading: boolean;
  AbiError: unknown;
}

export const ContractContext = createContext<ContractContextType>({
  contractAddress: undefined,
  setContractAddress: () => {},
  contractSource: '',
  abi: undefined,
  selectedChainId: 0,
  setSelectedChainId: () => {},
  contractFunctions: undefined,
  showFunctions: false,
  setShowFunctions: () => {},
  isLoading: false,
  AbiError: null,
});

function ContractProvider({ children }: { children: React.ReactNode }) {
  const [contractAddress, setContractAddress] = useState<Address>();
  const [showFunctions, setShowFunctions] = useState(false);
  const [selectedChainId, setSelectedChainId] = useState<number>(11155111); // default sepolia

  const extractFunctions = (abi: Abi): AbiFunction[] => {
    return abi.filter((item): item is AbiFunction => item.type === 'function');
  };

  const {
    data,
    isLoading,
    error: AbiError,
  } = useQuery({
    queryKey: ['abi', contractAddress, selectedChainId],
    queryFn: async (): Promise<{
      contractSource: string;
      abi: Abi;
      functions: AbiFunction[];
    }> => {
      const contract = await contractService.contractSource(selectedChainId, contractAddress!);
      if (!contract) {
        throw new Error(
          `No contract found at address ${contractAddress} or the source code is not verified on Etherscan`,
        );
      }

      const parsedAbi = AbiSchema.safeParse(contract.abi);
      if (!parsedAbi.success) {
        throw new Error(`Invalid ABI: ${parsedAbi.error}`);
      }
      console.log(parsedAbi.data);

      return {
        contractSource: contract.source,
        abi: parsedAbi.data,
        functions: extractFunctions(parsedAbi.data),
      };
    },
    enabled: !!contractAddress,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return (
    <ContractContext.Provider
      value={{
        contractAddress,
        setContractAddress,
        contractSource: data?.contractSource,
        abi: data?.abi,
        selectedChainId,
        setSelectedChainId,
        contractFunctions: data?.functions,
        showFunctions,
        setShowFunctions,
        isLoading,
        AbiError,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
}

export const useContract = () => useContext(ContractContext);
export default ContractProvider;
