import { type Address } from 'abitype';
import useContract from '../hooks/useContract';
import { useChainId } from '../stores/useContractStore';
import { useContractLocationActions } from '../stores/useContractStore';
import { useShowFunctions } from '../stores/useUiPanelStore';
import { useUiPanelActions } from '../stores/useUiPanelStore';
import { isAddress } from 'thirdweb/utils';
import { type ChangeEvent, useEffect, useState } from 'react';
import contractService from '../services/contractService';
import { useNotificationActions } from '../stores/useNotifications';

function SearchField() {
  const [inputValue, setInputValue] = useState('');
  const { AbiError } = useContract();
  const { setContractAddress } = useContractLocationActions();
  const showFunctions = useShowFunctions();
  const { setShowFunctions } = useUiPanelActions();
  const { pushNotification } = useNotificationActions();
  const chainId = useChainId();

  useEffect(() => {
    if (!AbiError) return;
    pushNotification({ msg: (AbiError as Error).message, type: 'error' });
  }, [AbiError]);

  const checkIfContract = async (address: Address) => {
    try {
      return await contractService.isContract(chainId, address);
    } catch (err) {
      pushNotification({ msg: (err as Error).message, type: 'error' });
      return false;
    }
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const address = e.target.value as Address;
    setInputValue(address);

    if (isAddress(address)) {
      const isContract = await checkIfContract(address);

      if (!isContract) {
        pushNotification({ msg: 'No contract found at this address', type: 'error' });
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
      pushNotification({ msg: 'Invalid address', type: 'error' });
      return;
    }

    const isContract = await checkIfContract(address);
    if (!isContract) {
      pushNotification({ msg: 'No contract found at this address', type: 'error' });
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
      
    </div>
  );
}

export default SearchField;
