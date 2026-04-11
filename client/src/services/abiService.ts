import axios from 'axios'
import { Abi } from '../schemas/abi'

const baseUrl = '/api/abi'

const handleApiError = (error: unknown) => {
	if (axios.isAxiosError(error)) {
		if (error.response) {

			throw new Error(error.response.data.error || 'API Error')
		} else if (error.request) {

      console.error('No response from API:', error.request)
			throw new Error('No response from API')
		} else {

      console.error('Error setting up API request:', error.message)
			throw new Error('Error setting up API request')
		}
	} else {
    console.error('Unexpected error:', error)
		throw new Error('Unexpected error')
	}
}

const getAbi = async (chainId: number, address: string): Promise<Abi> => {
	try {
		const req = await axios.get(`${baseUrl}/${chainId}/${address}`)
		return req.data
	} catch (error) {
		return handleApiError(error)
	}
}

export default { getAbi }
