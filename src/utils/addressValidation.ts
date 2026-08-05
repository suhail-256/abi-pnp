import { Address } from 'abitype';
import { isAddress, defineChain } from 'thirdweb';
import { getChainMetadata } from 'thirdweb/chains';

interface ValidationResponse {
  success: boolean;
  msg: string | null;
}

export const validateContract = async (
  chainId: number,
  address: Address,
): Promise<ValidationResponse> => {
  if (!isAddress(address))
    return {
      success: false,
      msg: 'Invalid address format',
    };

  try {
    // define a cain
    const chain = defineChain(chainId);

    // This WILL fail if the chain ID doesn't exist)
    await getChainMetadata(chain);
  } catch {
    return {
      success: false,
      msg: 'Invalid chain id',
    };
  } 

  return { success: true, msg: null };
};
