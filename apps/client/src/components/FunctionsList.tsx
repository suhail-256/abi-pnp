import useContract from '../hooks/useContract';
import FunctionCard from './FunctionCard';

function FunctionsList() {
  const { contractFunctions, isPending } = useContract();

  // TODO: enhance ui
  if (isPending) return <p>Loading</p>
  
  if (!contractFunctions) throw new Error('`contractFunctions` not found');

  return (
    <div className="functions-list">
      {contractFunctions.map(({id, ...fnInfo}) => (
        <FunctionCard key={id} fnInfo={fnInfo} />
      ))}
    </div>
  );
}

export default FunctionsList;
