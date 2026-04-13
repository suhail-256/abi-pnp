import React from 'react';
import errorHandler from '../utils/errorUtils';
// component that takes isSuccess & result (from ReadButton & WriteButton) and displays the output or the error
interface ResultProps {
	result: any;
}

function Result({ result }: ResultProps) {
	if (result.isSuccess && result.data !== undefined) {
		if (typeof result.data === 'object')
			return result.data.map((item: any, index: number) => (
				<div key={index}>
					[{index}] &nbsp; {item}
				</div>
			));
		else return <div>{String(result.data)}</div>;
	} else if (result.isError)
		return <div>{`Error: ${errorHandler.getErrorMessage(result.error)}`} </div>;
}

export default Result;
