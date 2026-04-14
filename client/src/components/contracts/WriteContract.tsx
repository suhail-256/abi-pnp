import { useContract } from '../../context/ContractContext';
import { Address, type AbiFunction } from '../../types/contract';
import { useWriteContract } from 'wagmi';
import Result from '../Result';
import { useState, useEffect, useRef } from 'react';
import { useConnection } from 'wagmi';

interface WriteButtonProps {
	func: AbiFunction;
	args: string[];
	buttonRef?: React.RefObject<HTMLButtonElement | null>;
}

function WriteButton({ func, args, buttonRef }: WriteButtonProps) {
	const { isConnected } = useConnection();
	const { contractAddress, abi } = useContract();
	const [submittedArgs, setSubmittedArgs] = useState<(string | string[] | undefined)[]>([]);

	const hasSubmitted = useRef(false);
	const writeContract = useWriteContract({
		mutation: {
			onSuccess(data) {
				console.log('tx hash:', data);
			},
			onError(error) {
				console.error('failed:', error);
			},
		},
	});

	useEffect(() => {
		if (!hasSubmitted.current) return;
		writeContract.mutate({
			address: contractAddress as Address,
			abi: abi as any,
			functionName: func.name,
			args: parseArgs(args),
		});
	}, [submittedArgs]);

	if (!isConnected) {
		return (
			<button className="action-btn action-btn--write" ref={buttonRef} type="button" disabled>
				Connect Wallet
			</button>
		);
	}

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

	const handleWrite = () => {
		setSubmittedArgs(parseArgs(args));
		hasSubmitted.current = true;
	};

	return (
		<>
			<button className="action-btn action-btn--write" ref={buttonRef} type="button" onClick={handleWrite}>
				Write
			</button>
			{writeContract.status === 'success' && <Result result={writeContract} />}
		</>
	);
}

export default WriteButton;
