import axios from 'axios';
import type { Abi, Address } from 'abitype';
import errorHandler from '../utils/errorUtils';

const baseUrl = import.meta.env.VITE_API_URL ?? '';

const contractSource = async (
  chainId: number,
  address: Address,
): Promise<{ source: string; abi: Abi }> => {
  try {
    const req = await axios.get(`${baseUrl}/api/contract-source/${chainId}/${address}`);
    return req.data;
  } catch (err) {
    return errorHandler.handleApiError(err);
  }
};


export default { contractSource };
