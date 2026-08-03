import { useState } from 'react';
import { useReadContract } from 'thirdweb/react';
import { Address, type AbiFunction } from 'abitype';
import Result from '../Result';
import { ArgValue } from '../../types';
import { Abi } from 'abitype';
import { client } from '../Connect';
import { defineChain, getContract } from 'thirdweb';
import useContract from '../../hooks/useContract';
import { useChainId, useContractAddress } from '../../stores/useContractStore';

interface ReadButtonProps {
  fn: AbiFunction;
  args: ArgValue[];
}

function ReadButton({ fn, args }: ReadButtonProps) {
  const { abi } = useContract();
  const contractAddress = useContractAddress();
  const chainId = useChainId();
  const [displayData, setDisplayData] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const activeChain = defineChain(chainId);

  const contract = getContract({
    client,
    address: contractAddress as Address,
    chain: activeChain,
    abi: abi as Abi,
  });

  const { refetch } = useReadContract({
    contract,
    method: fn.name,
    params: args,
    queryOptions: {
      enabled: false,
    },
  });

  const handleRead = async () => {
    setIsFetching(true);
    try {
      const result = await refetch();
      setDisplayData(result.data);
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
      {displayData !== null && <Result data={displayData} />}
    </>
  );
}

export default ReadButton;
