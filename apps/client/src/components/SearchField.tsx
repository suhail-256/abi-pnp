import { type Address } from '../types/contract';
import useContract from '../hooks/useContract';
import { useChainId } from '../stores/useContractStore';
import { useContractLocationActions } from '../stores/useContractStore';
import { useShowFunctions } from '../stores/useUiPanelStore';
import { useUiPanelActions } from '../stores/useUiPanelStore';
import { isAddress } from 'thirdweb/utils';
import { type ChangeEvent, useEffect, useState } from 'react';
import contractService from '../services/contractService';

function SearchField() {
  const [inputValue, setInputValue] = useState('');
  const { AbiError } = useContract();
  const { setContractAddress } = useContractLocationActions();
  const showFunctions = useShowFunctions();
  const { setShowFunctions } = useUiPanelActions();
  const [displayError, setDisplayError] = useState<string | null>(null);
  const chainId = useChainId();

  const [contractValidityCache, setContractValidityCache] = useState<
    Record<number, Record<Address, boolean>>
  >({});

  useEffect(() => {
    if (!displayError) return;
    setShowFunctions(false);

    const timer = setTimeout(() => setDisplayError(null), 3000);
    return () => clearTimeout(timer);
  }, [displayError]);

  useEffect(() => {
    if (!AbiError) return;
    setDisplayError((AbiError as Error).message);
  }, [AbiError]);

  useEffect(() => {
    if (showFunctions) setDisplayError(null);
  }, [showFunctions]);

  const checkIfContract = async (address: Address) => {
    try {
      return await contractService.isContract(chainId, address);
    } catch (err) {
      setDisplayError((err as Error).message);
      return false;
    }
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const address = e.target.value as Address;
    setInputValue(address);

    if (isAddress(address) && contractValidityCache[chainId]?.[address] === undefined) {
      const isContract = await checkIfContract(address);
      setContractValidityCache(prev => ({
        ...prev,
        [chainId]: { ...prev[chainId], [address]: isContract },
      }));

      if (!isContract) {
        setDisplayError('No contract found at this address');
        return;
      }

      if (!showFunctions) {
        setContractAddress(address);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const address = inputValue as Address;

    if (!isAddress(address)) {
      setDisplayError('Invalid address');
      return;
    }

    const isContract =
      contractValidityCache[chainId]?.[address] ?? (await checkIfContract(address));
    if (!isContract) {
      setDisplayError('No contract found at this address');
      return;
    }

    setContractAddress(address);
    setShowFunctions(true);
  };

  return (
    <div>
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          className="search-input"
          value={inputValue}
          onChange={handleChange}
          type="text"
          placeholder="0x000..."
        />
        <button className="search-submit" type="submit" aria-label="Search">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </form>
      {displayError && (
        <div className="error-alert search-error">
          <span className="error-alert-icon" aria-hidden="true">
            !
          </span>
          <span>{displayError}</span>
        </div>
      )}
    </div>
  );
}

export default SearchField;
