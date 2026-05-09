import { useContract } from '../../context/ContractContext';
import { ArgValue } from '../../types/argValue';
import { Abi, Address, type AbiFunction } from '../../types/contract';
import Result from '../Result';
import { useState } from 'react';
import { client, wallets, theme } from '../Connect';
import {
  ConnectButtonProps,
  lightTheme,
  TransactionButton,
  useConnectModal,
  useActiveAccount,
} from 'thirdweb/react';
import { defineChain, getContract, prepareContractCall } from 'thirdweb';

interface SendButtonProps {
  fn: AbiFunction;
  args: ArgValue[];
  payableValue?: bigint;
}

function SendButton({ fn, args, payableValue }: SendButtonProps) {
  const { contractAddress, abi, selectedChainId } = useContract();

  const account = useActiveAccount();
  const isConnected = !!account;
  const { connect } = useConnectModal();

  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<`0x${string}` | null>(null);

  const activeChain = defineChain(selectedChainId);

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
      <button className="action-btn action-btn--write" type="button" onClick={handleConnect}>
        Connect Wallet
      </button>
    );
  }

  const handleSend = async () => {
    const contract = getContract({
      address: contractAddress as Address,
      abi: abi as Abi,
      chain: activeChain,
      client,
    });

    return prepareContractCall({
      contract: contract,
      method: fn.name,
      params: args,
      value: payableValue,
    });
  };

  return (
    <>
      <TransactionButton
        className="action-btn action-btn--write"
        theme={lightTheme()}
        style={{
          borderRadius: 'var(--radius-sm)',
          width: '120px',
          minWidth: '120px',
          height: '31px',
          fontSize: '13px',
        }}
        transaction={handleSend}
        onTransactionSent={transactionResult => {
          setTransactionHash(transactionResult.transactionHash);
          setIsConfirming(true);
        }}
        onTransactionConfirmed={receipt => {
          setReceipt(receipt);
          setIsConfirmed(true);
          setIsConfirming(false);
        }}
        onError={error => {
          // TODO: better error handling
          console.error('Transaction error:', error);
        }}
      >
        Send
      </TransactionButton>
      {(isConfirming || isConfirmed) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <Result data={`Tx: ${transactionHash}`} />
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
