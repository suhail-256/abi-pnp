import { type Address } from '../types/contract';
import { useContract } from '../context/ContractContext';
import { isAddress } from 'viem';
import { type ChangeEvent, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import abiService from '../services/abiService';

function SearchField() {
  const [inputValue, setInputValue] = useState('');
  const { setContractAddress, showFunctions, setShowFunctions, AbiError } = useContract();
  const [displayError, setDisplayError] = useState<string | null>(null);
  const { selectedChainId } = useContract();
  const queryClient = useQueryClient();

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
      const isContract = await abiService.isContract(selectedChainId, address);
      if (!isContract) {
        setDisplayError('No contract found at this address');
        return false;
      }
    } catch (err) {
      setDisplayError((err as Error).message);
      return false;
    }
    return true;
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const address = e.target.value as Address;
    setInputValue(address);

    if (isAddress(address)) {
      const isContract = await checkIfContract(address);
      if (!isContract) return;

      if (!showFunctions) {
        setContractAddress(address);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isAddress(inputValue)) {
      setDisplayError('Invalid address');
      return;
    }
    queryClient.removeQueries({ queryKey: ['abi', inputValue, selectedChainId] });

    const isContract = await checkIfContract(inputValue as Address);
    if (!isContract) return;

    setContractAddress(inputValue as Address);
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
