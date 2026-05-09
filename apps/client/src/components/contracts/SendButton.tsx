import { useContract } from '../../context/ContractContext';
import { ArgValue } from '../../types/argValue';
import { Abi, Address, type AbiFunction } from '../../types/contract';
import Result from '../Result';
import { useState } from 'react';
import {
  useConnection,
  useWaitForTransactionReceipt,
  useWriteContract,
  useConnect,
} from 'wagmi';
import { ConnectButtonProps, useConnectModal } from 'thirdweb/react';
import { client, wallets, theme } from '../Connect';
import { defineChain } from 'thirdweb';

interface SendButtonProps {
  fn: AbiFunction;
  args: ArgValue[];
  payableValue?: bigint;
}

function SendButton({ fn, args, payableValue }: SendButtonProps) {
  const { isConnected } = useConnection();
  const { contractAddress, abi, selectedChainId } = useContract();
  const { status } = useConnect();
  const { connect } = useConnectModal();

  const [showReceipt, setShowReceipt] = useState<boolean>(false);

  const writeContract = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash: writeContract.data,
  });

  const handleConnect = async () => {
    await connect({
      client: client,
      wallets: wallets,
      theme: theme,
      size: 'compact',
      chain: defineChain(selectedChainId),
    } as ConnectButtonProps);
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

  const handleWrite = async () => {
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
        {isConfirming ? 'Confirming...' : writeContract.isPending ? 'Pending...' : 'Send'}
      </button>
      {(isConfirming || isConfirmed) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <Result data={`Tx: ${writeContract.data}`} />
          {isConfirmed && receipt && (
            <div className={`wrapper-card ${showReceipt ? 'wrapper-card--open' : ''}`}>
              <div className="wrapper-header" onClick={() => setShowReceipt(prev => !prev)}>
                <span className="wrapper-params">Receipt</span>
                <span
                  className={`wrapper-chevron ${showReceipt ? 'wrapper-chevron--open' : ''}`}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M3 4.5L6 7.5L9 4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
              <div className={`wrapper-body ${showReceipt ? 'wrapper-body--open' : ''}`}>
                <div className="wrapper-body-inner">
                  <Result data={receipt} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default SendButton;
