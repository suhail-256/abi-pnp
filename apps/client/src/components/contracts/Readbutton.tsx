import { useContract } from '../../context/ContractContext';
import { Address, type AbiFunction } from '../../types/contract';
import { useReadContract } from 'wagmi';
import Result from '../Result';
import { ArgValue } from '../../types/argValue';

interface ReadButtonProps {
  fn: AbiFunction;
  args: ArgValue[];
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

function ReadButton({ fn, args, buttonRef }: ReadButtonProps) {
  const { contractAddress, abi, selectedChainId } = useContract();

  const readContract = useReadContract({
    address: contractAddress as Address,
    abi: abi,
    chainId: selectedChainId,
    functionName: fn.name,
    args: args,
    query: {
      enabled: false,
      retry: false,
    },
  });

  const handleRead = () => {
    readContract.refetch({
      throwOnError: true,
      cancelRefetch: false,
    });
  };

  return (
    <>
      <button
        className="action-btn action-btn--read"
        ref={buttonRef}
        type="button"
        onClick={handleRead}
        disabled={readContract.isFetching}
      >
        {readContract.isFetching ? 'Reading...' : 'Read'}
      </button>
      {readContract.isFetched && <Result result={readContract} />}
    </>
  );
}

export default ReadButton;
