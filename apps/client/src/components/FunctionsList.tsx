import useContract from '../hooks/useContract';
import FunctionCard from './FunctionCard';
import { useParams, useNavigate } from 'react-router-dom';
import { useContractLocationActions } from '../stores/useContractStore';
import { useEffect } from 'react';
import { Address } from 'abitype';
import { validateContract } from '../utils/addressValidation';
import { useNotificationActions } from '../stores/useNotifications';

function FunctionsList() {
  const { contractFunctions, isPending, AbiError } = useContract();
  const { pushNotification } = useNotificationActions();
  const { setChainId, setContractAddress } = useContractLocationActions();
  const { chainId, contractAddress } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    validateContract(+chainId!, contractAddress as Address).then(result => {
      if (!result.success) {
        pushNotification({ msg: result.msg!, type: 'error' });
        navigate('/');
        return;
      }
      setChainId(+chainId!);
      setContractAddress(contractAddress! as Address);
    });
  }, [chainId, contractAddress]);

  if (AbiError) return null;

  // TODO: enhance ui
  if (isPending) return <p>Loading</p>;

  if (!contractFunctions) throw new Error('`contractFunctions` not found');

  return (
    <div className="functions-list">
      {contractFunctions.map(({ id, ...fnInfo }) => (
        <FunctionCard key={id} fnInfo={fnInfo} />
      ))}
    </div>
  );
}

export default FunctionsList;
