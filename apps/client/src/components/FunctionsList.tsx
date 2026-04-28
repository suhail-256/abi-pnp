import { useContract } from '../context/ContractContext';
import FunctionCard from './FunctionCard';

function FunctionsList() {
  const { functions } = useContract();

  return (
    <div className="functions-list">
      {functions?.map((func, index) => (
        <FunctionCard key={index} func={func} />
      ))}
    </div>
  );
}

export default FunctionsList;
