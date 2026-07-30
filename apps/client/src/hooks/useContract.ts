import { useQuery } from '@tanstack/react-query';
import { Abi, AbiFunction } from 'abitype';
import contractService from '../services/contractService';
import { AbiSchema } from '../types/contract';
import { useContractAddress, useChainId } from '../stores/useContractStore';

const extractFunctions = (abi: Abi): AbiFunction[] => {
  return abi.filter((item): item is AbiFunction => item.type === 'function');
};

function useContract() {
  const contractAddress  = useContractAddress();
  const chainId = useChainId();

  const {
    data,
    isLoading,
    error: AbiError,
  } = useQuery({
    queryKey: ['contracts', contractAddress, chainId],
    queryFn: async (): Promise<{
      contractSource: string;
      abi: Abi;
      functions: AbiFunction[];
    }> => {
      console.log(`addresss: ${contractAddress}`);
      
      const contract = await contractService.contractSource(chainId, contractAddress!);
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

  return {
    contractSource: data?.contractSource,
    abi: data?.abi,
    contractFunctions: data?.functions,
    isLoading,
    AbiError,
  };
}


export default useContract;