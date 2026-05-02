import { useContract } from '../../context/ContractContext';
import { Abi, Address, type AbiFunction } from '../../types/contract';
import Result from '../Result';
import {
  useConnection,
  useConnectors,
  useWaitForTransactionReceipt,
  useWriteContract,
  useConnect,
} from 'wagmi';

interface WriteButtonProps {
  fn: AbiFunction;
  args: string[];
  payableValue?: bigint;
}

function WriteButton({ fn, args, payableValue }: WriteButtonProps) {
  const { isConnected } = useConnection();
  const { contractAddress, abi } = useContract();
  const connectors = useConnectors();
  const { connect, status } = useConnect();

  const writeContract = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeContract.data,
  });

  const handleConnect = () => {
    connect({ connector: connectors[0] });
  };

  if (!isConnected) {
    return (
      <button
        className="action-btn action-btn--write"
        type="button"
        onClick={handleConnect}
        disabled={status === 'pending'}
      >
        {status === 'pending' ? 'Connecting...' : 'Connect Wallet'}
      </button>
    );
  }

  const handleWrite = () => {
    writeContract.mutate({
      address: contractAddress as Address,
      abi: abi as Abi,
      functionName: fn.name,
      args: args,
      value: payableValue,
    });
  };

  return (
    <>
      <button
        className="action-btn action-btn--write"
        type="button"
        onClick={handleWrite}
        disabled={isConfirming || writeContract.isPending}
      >
        {isConfirming ? 'Confirming...' : writeContract.isPending ? 'Pending...' : 'Write'}
      </button>
      {isConfirmed && <Result result={writeContract} />}
    </>
  );
}

export default WriteButton;
