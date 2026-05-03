import axios from 'axios';
import type { Abi, Chain, Address } from '../types/contract';
import errorHandler from '../utils/errorUtils';

const baseUrl = '/api';

const contractSource = async (
  chainId: Chain['id'],
  address: Address,
): Promise<{ source: string; abi: Abi }> => {
  try {
    const req = await axios.get(`${baseUrl}/contract-source/${chainId}/${address}`);
    return req.data;
  } catch (err) {
    return errorHandler.handleApiError(err);
  }
};

const isContract = async (chainId: Chain['id'], address: Address): Promise<boolean> => {
  try {
    const req = await axios.get(`${baseUrl}/is-contract/${chainId}/${address}`);
    return req.data.isContract;
  } catch (err) {
    return errorHandler.handleApiError(err);
  }
};

export default { contractSource, isContract };
