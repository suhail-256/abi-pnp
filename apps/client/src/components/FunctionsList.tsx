import { useContract } from '../context/ContractContext';
import FunctionCard from './FunctionCard';

function FunctionsList() {
  const { contractFunctions } = useContract();

  return (
    <div className="functions-list">
      {contractFunctions?.map((functionInfo, index) => (
        <FunctionCard key={index} fnInfo={functionInfo} />
      ))}
    </div>
  );
}

export default FunctionsList;
