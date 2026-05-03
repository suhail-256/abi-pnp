import axios from 'axios';
import errorHandler from '../utils/errorUtils';
import { useContract } from '../context/ContractContext';

const baseUrl = '/api';

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
    const req = await axios.post(`${baseUrl}/explain`, {
      contractSource,
      functionABI,
    });
    return req.data;
  } catch (err) {
    return errorHandler.handleApiError(err);
  }
};

export default { explainFunction };
