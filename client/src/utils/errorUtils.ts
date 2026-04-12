import { ContractFunctionExecutionError, ContractFunctionRevertedError } from 'viem';

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
  return 'Tx reverted with unknown error';
};

export default { getErrorMessage };