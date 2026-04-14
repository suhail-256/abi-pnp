import { useContract } from '../../context/ContractContext';
import { AbiParameter, Address, type AbiFunction } from '../../types/contract';
import { useReadContract, UseReadContractParameters } from 'wagmi';
import errorHandler from '../../utils/errorUtils';
import Result from '../Result';
import { useState, useEffect, useRef } from 'react';

interface ReadButtonProps {
	func: AbiFunction;
	args: string[];
	buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

// TODO handle tuple type in the future
function ReadButton({ func, args, buttonRef }: ReadButtonProps) {
	const { contractAddress, abi, selectedChainId } = useContract();
	const [submittedArgs, setSubmittedArgs] = useState<(string | string[] | undefined)[]>([]);

	const hasSubmitted = useRef(false);

	const result = useReadContract({
		address: contractAddress as Address,
		abi: abi,
		chainId: selectedChainId,
		functionName: func.name,
		args: submittedArgs,
		query: {
			enabled: false,
			retry: false,
		},
	});

	useEffect(() => {
		if (!hasSubmitted.current) return;
		result.refetch({
			throwOnError: true,
			cancelRefetch: false,
		});
		// hasSubmitted.current = false;
	}, [submittedArgs]);

	const getArrayDim = (type: string): number => {
		const matches = type.match(/\[/g);
		return matches ? matches.length : 0;
	};

	const parseArgs = (args: string[]) => {
		return args.map((arg, index) => {
			if (arg === undefined) return undefined;
			const arrayDim = getArrayDim(func.inputs![index].type);

			if (arrayDim > 0) {
				try {
					// for array type, split by comma and trim spaces (handle 1d array and multi-dim array)
					return arg.split(',').map(item => item.trim());
				} catch (error) {
					console.error(`Error parsing arguments: ${error}`);
					return arg;
				}
			}
			return arg;
		});
	};

	const handleRead = () => {
		try {
			setSubmittedArgs(parseArgs(args));
			hasSubmitted.current = true;
		} catch (error) {
			console.error(`Error: ${errorHandler.getErrorMessage(error)}`);
		}
	};

	return (
		<>
			<button className="action-btn action-btn--read" ref={buttonRef} type="button" onClick={handleRead}>Read</button>
			{result.isFetched && <Result result={result} />}
		</>
	);
}

export default ReadButton;
