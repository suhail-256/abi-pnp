const getErrorMessage = (error: unknown): string => {
  console.error('Error:', error);
  return 'Tx reverted';
};

const parseJsonResponse = async <T>(res: Response): Promise<T> => {
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      typeof body === 'object' && body !== null && 'error' in body && typeof body.error === 'string'
        ? body.error
        : `Request failed (${res.status})`;
    throw new Error(message);
  }

  return body as T;
};

const handleApiError = (err: unknown): never => {
  if (err instanceof Error) {
    console.error('API Error:', err.message);
    throw err;
  }

  console.error('Unexpected error:', err);
  throw new Error('Unexpected error');
};

export default { getErrorMessage, parseJsonResponse, handleApiError };
