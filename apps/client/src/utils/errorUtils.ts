import axios from 'axios';

const getErrorMessage = (error: unknown): string => {
  // TODO: improve this function to handle different error types and extract meaningful messages
  console.error('Error:', error);
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
