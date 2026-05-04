import { useState } from 'react';
import { useConfig } from 'wagmi';
import { readContract } from 'wagmi/actions';
import { useContract } from '../../context/ContractContext';
import { Address, type AbiFunction } from '../../types/contract';
import Result from '../Result';
import { ArgValue } from '../../types/argValue';
import { Abi } from 'viem';

interface ReadButtonProps {
  fn: AbiFunction;
  args: ArgValue[];
}

function ReadButton({ fn, args }: ReadButtonProps) {
  const { contractAddress, abi, selectedChainId } = useContract();
  const [displayData, setDisplayData] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);

  const config = useConfig();

  const handleRead = async () => {
    setIsFetching(true);
    try {
      const result = await readContract(config, {
        address: contractAddress as Address,
        abi: abi as Abi,
        chainId: selectedChainId,
        functionName: fn.name,
        args: args,
      });

      setDisplayData(result);
    } catch (error) {
      // TODO: Handle error properly
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <>
      <button
        className="action-btn action-btn--read"
        type="button"
        onClick={handleRead}
        disabled={isFetching}
      >
        {isFetching ? 'Reading...' : 'Read'}
      </button>
      {displayData && <Result data={displayData} />}
    </>
  );
}

export default ReadButton;
