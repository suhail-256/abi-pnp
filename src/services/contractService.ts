import type { Abi, Address } from 'abitype';
import apiHandler from '../utils/apiUtils';

const baseUrl = '/api';

const contractSource = async (
  chainId: number,
  address: Address,
): Promise<{ source: string; abi: Abi }> => {
  try {
    const res = await fetch(`${baseUrl}/${chainId}/${address}`);
    return await apiHandler.parseJsonResponse(res);
  } catch (err) {
    return apiHandler.handleApiError(err);
  }
};

export default { contractSource };
