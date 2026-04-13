import React from 'react';
import errorHandler from '../../utils/errorUtils';
// component that takes isSuccess & result (from ReadButton & WriteButton) and displays the output or the error
interface ResultProps {
	result: any;
}

function Result({ result }: ResultProps) {
	if (result.isSuccess && result.data !== undefined) {
		return <div>{JSON.stringify(result.data).replace(/"/g, '')}</div>;
	} else if (result.isError)
		return <div>{`Error: ${errorHandler.getErrorMessage(result.error)}`} </div>;
}

export default Result;
