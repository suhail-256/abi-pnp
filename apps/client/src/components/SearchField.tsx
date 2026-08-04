import { type Address } from 'abitype';
import useContract from '../hooks/useContract';
import { useChainId } from '../stores/useContractStore';
import { type ChangeEvent, useEffect, useState } from 'react';
import { useNotificationActions } from '../stores/useNotifications';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { validateContract } from '../utils/addressValidation';

function SearchField() {
  const [inputValue, setInputValue] = useState('');
  const { AbiError } = useContract();
  const { pushNotification } = useNotificationActions();
  const queryClient = useQueryClient();
  const chainId = useChainId();
  const navigate = useNavigate();

  useEffect(() => {
    if (!AbiError) return;
    pushNotification({ msg: (AbiError as Error).message, type: 'error' });
  }, [AbiError]);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) =>
    setInputValue(e.target.value as Address);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const address = inputValue as Address;

    const { success, msg } = await validateContract(chainId, address);
    if (!success) {
      pushNotification({ msg: msg!, type: 'error' });
      navigate('/')
      return;
    }
    queryClient.invalidateQueries({ queryKey: ['contracts'] });
    navigate(`/${chainId}/${address}`);
  };

  return (
    <>
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
    </>
  );
}

export default SearchField;
