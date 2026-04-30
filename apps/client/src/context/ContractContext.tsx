import { createContext, useContext, useState } from 'react';
import { AbiSchema, type Abi, type AbiFunction, type Address } from '../types/contract';
import { useQuery } from '@tanstack/react-query';
import abiService from '../services/abiService';

interface ContractContextType {
  contractAddress: Address | undefined;
  setContractAddress: (address: Address) => void;
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
    queryFn: async (): Promise<{ abi: Abi; functions: AbiFunction[] }> => {
      let fetchedAbi;
      fetchedAbi = await abiService.getAbi(selectedChainId, contractAddress!);
      if (!fetchedAbi) {
        throw new Error(
          `No ABI found for address ${contractAddress} on chain ${selectedChainId}`,
        );
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
    refetchOnWindowFocus: false,
  });

  return (
    <ContractContext.Provider
      value={{
        contractAddress,
        setContractAddress,
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
