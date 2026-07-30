import { useState, useRef, useEffect } from 'react';
import { useSwitchActiveWalletChain, useActiveAccount } from 'thirdweb/react';
import { defineChain } from 'thirdweb';
// import { useContract } from '../context/ContractContext';
import { useChainId } from '../stores/useContractStore';
import { useContractLocationActions } from '../stores/useContractStore';
import * as suuportedChains from '../../config/chains';

function ChainSelector() {
  const chains = Object.values(suuportedChains);
  const chainId  = useChainId();
  const { setChainId } = useContractLocationActions();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const account = useActiveAccount();
  const isConnected = !!account;
  const switchChain = useSwitchActiveWalletChain();

  const selectedChain = chains.find(c => c.id === chainId);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleSelect = async (chainId: number) => {
    setChainId(chainId);
    setOpen(false);
    if (!isConnected) return;

    try {
      await switchChain(defineChain(chainId));
    } catch (error) {
      console.error('Failed to switch wallet network:', error);
    }
  };

  return (
    <div className="chain-dropdown" ref={ref}>
      <button type="button" className="chain-trigger" onClick={() => setOpen(prev => !prev)}>
        <span className="chain-trigger-label">{selectedChain?.name ?? 'Chain'}</span>
        <svg
          className={`chain-trigger-chevron ${open ? 'chain-trigger-chevron--open' : ''}`}
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
        >
          <path
            d="M1 1L5 5L9 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className={`chain-menu-wrapper ${open ? 'chain-menu-wrapper--open' : ''}`}>
        <div className="chain-menu-inner">
          <ul className="chain-menu">
            {chains.map(chain => (
              <li
                key={chain.id}
                className={`chain-menu-item ${chain.id === chainId ? 'chain-menu-item--active' : ''}`}
                onClick={() => handleSelect(chain.id)}
              >
                {chain.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ChainSelector;
