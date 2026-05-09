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
  activeAiPanel: string | null;
  setActiveAiPanel: (id: string | null) => void;
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
  activeAiPanel: null,
  setActiveAiPanel: () => {},
  isLoading: false,
  AbiError: null,
});

function ContractProvider({ children }: { children: React.ReactNode }) {
  const [contractAddress, setContractAddress] = useState<Address>();
  const [showFunctions, setShowFunctions] = useState(false);
  const [selectedChainId, setSelectedChainId] = useState<number>(11155111); // default sepolia
  const [activeAiPanel, setActiveAiPanel] = useState<string | null>(null);
  // const test: Abi = [
  //   {
  //     name: 'submitProposal',
  //     type: 'function',
  //     stateMutability: 'payable',
  //     inputs: [
  //       {
  //         name: 'id',
  //         type: 'uint256',
  //         internalType: 'uint256',
  //       },
  //       {
  //         name: 'commitment',
  //         type: 'bytes32',
  //         internalType: 'bytes32',
  //       },
  //       {
  //         name: 'metadata',
  //         type: 'bytes',
  //         internalType: 'bytes',
  //       },
  //       {
  //         name: 'isActive',
  //         type: 'bytes8',
  //         internalType: 'bytes8',
  //       },
  //       {
  //         name: 'fixedCoordinateMatrix',
  //         type: 'uint256[10][4][2]',
  //         internalType: 'uint256[10][4][2]',
  //       },
  //       {
  //         name: 'dynamicDataCube',
  //         type: 'uint256[][][]',
  //         internalType: 'uint256[][][]',
  //       },
  //       {
  //         name: 'proposer',
  //         type: 'tuple',
  //         internalType: 'struct Governance.ProposerProfile',
  //         components: [
  //           { name: 'uid', type: 'uint256', internalType: 'uint256' },
  //           { name: 'wallet', type: 'address', internalType: 'address' },
  //           {
  //             name: 'flags',
  //             type: 'bool[]',
  //             internalType: 'bool[]',
  //           },
  //         ],
  //       },
  //       {
  //         name: 'batches',
  //         type: 'tuple[]',
  //         internalType: 'struct Governance.ActionBatch[]',
  //         components: [
  //           {
  //             name: 'identifier',
  //             type: 'bytes32',
  //             internalType: 'bytes32',
  //           },
  //           {
  //             name: 'gridData',
  //             type: 'bytes16[2][]',
  //             internalType: 'bytes16[2][]',
  //           },
  //         ],
  //       },
  //     ],
  //     outputs: [{ name: 'success', type: 'bool', internalType: 'bool' }],
  //   },
  // ];
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
        activeAiPanel,
        setActiveAiPanel,
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
