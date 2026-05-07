import axios from 'axios';
import errorHandler from '../utils/errorUtils';
import { useContract } from '../context/ContractContext';

const baseUrl = import.meta.env.VITE_API_URL ?? '';

const explainFunction = async (
  contractSource: string,
  functionABI: string,
): Promise<{
  summary: string;
  inputs: { name: string; description: string }[];
  outputs: { description: string }[];
  warnings: string[];
}> => {
  try {
    const req = await axios.post(`${baseUrl}/api/explain`, {
      contractSource,
      functionABI,
    });
    return req.data;
  } catch (err) {
    return errorHandler.handleApiError(err);
  }
};

export default { explainFunction };
