import { ContractFunctionExecutionError, ContractFunctionRevertedError } from 'viem';
import axios from 'axios';

const getErrorMessage = (error: unknown): string => {
  if (error instanceof ContractFunctionExecutionError) {
    if (error.cause instanceof ContractFunctionRevertedError) {
      return (
        error.cause.reason ?? // "revert reason string"
        error.cause.data?.errorName ?? // custom error like "Unauthorized()"
        error.shortMessage
      );
    }
    return error.shortMessage;
  }
  return 'Tx reverted';
};

const handleApiError = (err: any) => {
  console.error('API Error:', err.response?.data);

  if (axios.isAxiosError(err)) {
    if (err.response) {
      throw new Error(err.response.data?.error || err.response.data || 'API Error');
    } else if (err.request) {
      console.error('No response from API:', err.request);
      throw new Error('No response from API');
    } else {
      console.error('Error setting up API request:', err.message);
      throw new Error('Error setting up API request');
    }
  } else {
    console.error('Unexpected error:', err);
    throw new Error('Unexpected error');
  }
};

export default { getErrorMessage, handleApiError };
