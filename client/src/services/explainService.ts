import apiHandler from '../utils/apiUtils';

const baseUrl = '/api';

const explainFunction = async (
  contractSource: string,
  functionABI: string,
): Promise<{
  summary: string;
  inputs: { name: string; description: string }[];
  outputs: { description: string }[];
  warnings: string[];
}> => {
  try {
    const res = await fetch(`${baseUrl}/explain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contractSource,
        functionABI,
      }),
    });

    return await apiHandler.parseJsonResponse(res);
  } catch (err) {
    return apiHandler.handleApiError(err);
  }
};

export default { explainFunction };
