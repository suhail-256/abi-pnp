import axios from 'axios';
import  type { Abi, Chain, Address }  from '../types/contract';

const baseUrl = '/api/abi';

const handleApiError = (err: any) => {
	console.error('API Error:', err.response?.data);

	if (axios.isAxiosError(err)) {
		if (err.response) {
			throw new Error(err.response.data || 'API Error');
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

const getAbi = async (chainId: Chain['id'], address: Address): Promise<Abi> => {
	try {
		const req = await axios.get(`${baseUrl}/${chainId}/${address}`);
		return req.data;
	} catch (err) {
		return handleApiError(err);
	}
};

export default { getAbi };
