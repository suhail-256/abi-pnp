import { useContract } from '../../context/ContractContext';
import { Address, type AbiFunction } from '../../types/contract';
import { useWriteContract } from 'wagmi';
import Result from '../Result';
import { useState, useEffect, useRef } from 'react';
import { useConnection } from 'wagmi';
import { type ArgValue } from '../../types/argValue';

interface WriteButtonProps {
  func: AbiFunction;
  args: string[];
  payableValue?: bigint;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

function WriteButton({ func, args, payableValue, buttonRef }: WriteButtonProps) {
  const { isConnected } = useConnection();
  const { contractAddress, abi } = useContract();
  const [submittedArgs, setSubmittedArgs] = useState<ArgValue[]>([]);

  const hasSubmitted = useRef(false);
  const writeContract = useWriteContract({
    mutation: {
      onSuccess(data) {
        console.log('tx hash:', data);
      },
      onError(error) {
        console.error('failed:', error);
      },
    },
  });

  useEffect(() => {
    if (!hasSubmitted.current) return;
    writeContract.mutate({
      address: contractAddress as Address,
      abi: abi as any,
      functionName: func.name,
      args: args,
      value: payableValue,
    });
  }, [submittedArgs]);

  if (!isConnected) {
    return (
      <button className="action-btn action-btn--write" ref={buttonRef} type="button" disabled>
        Connect Wallet
      </button>
    );
  }

  const handleWrite = () => {
    setSubmittedArgs(args);
    hasSubmitted.current = true;
  };

  return (
    <>
      <button
        className="action-btn action-btn--write"
        ref={buttonRef}
        type="button"
        onClick={handleWrite}
      >
        Write
      </button>
      {writeContract.status === 'success' && <Result result={writeContract} />}
    </>
  );
}

export default WriteButton;
