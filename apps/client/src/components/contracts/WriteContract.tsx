import { useContract } from '../../context/ContractContext';
import { Address, type AbiFunction } from '../../types/contract';
import Result from '../Result';
import {
  useConnection,
  useConnectors,
  useWaitForTransactionReceipt,
  useWriteContract,
  useConnect,
} from 'wagmi';

interface WriteButtonProps {
  func: AbiFunction;
  args: string[];
  payableValue?: bigint;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

function WriteButton({ func, args, payableValue, buttonRef }: WriteButtonProps) {
  const { isConnected } = useConnection();
  const { contractAddress, abi } = useContract();
  const connectors = useConnectors();
  const { connect, status } = useConnect();

  const writeContract = useWriteContract();

  const { isLoading, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeContract.data,
  });

  if (!isConnected) {
    return (
      <button
        className="action-btn action-btn--write"
        ref={buttonRef}
        type="button"
        onClick={() => connect({ connector: connectors[0] })}
        disabled={status === 'pending'}
      >
        {status === 'pending' ? 'Connecting...' : 'Connect Wallet'}
      </button>
    );
  }

  const handleWrite = () => {
    writeContract.mutate({
      address: contractAddress as Address,
      abi: abi as any,
      functionName: func.name,
      args: args,
      value: payableValue,
    });
  };

  return (
    <>
      <button
        className="action-btn action-btn--write"
        ref={buttonRef}
        type="button"
        onClick={handleWrite}
        disabled={isLoading || writeContract.isPending}
      >
        {isLoading ? 'Confirming...' : writeContract.isPending ? 'Pending...' : 'Write'}
      </button>
      {isConfirmed && <Result result={writeContract} />}
    </>
  );
}

export default WriteButton;
