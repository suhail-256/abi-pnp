import { useContract } from '../../context/ContractContext';
import { type AbiFunction, AbiSchema, AbiParameterSchema } from '../../types/contract';
import { useReadContract } from 'wagmi';
import errorHandler from '../../utils/errorUtils';

interface ReadButtonProps {
	func: AbiFunction;
	args: string[];
}

// TODO handle tuple type in the future
function ReadButton({ func, args }: ReadButtonProps) {
	const { contractAddress, abi } = useContract();

	// get arr dim by countring the number of [ in it
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

	const result = useReadContract({
		abi,
		address: contractAddress as `0x${string}`,
		functionName: func.name,
		args: args.length ? parseArgs(args) : undefined,
		query: { enabled: false, retry: false },
	});

	const handleQuery = async () => {
		try {
			console.log(parseArgs(args));
			await result.refetch({
				throwOnError: true,
				cancelRefetch: false,
			});
		} catch (error) {
			console.error(`Error: ${errorHandler.getErrorMessage(error)}`);
		}
	};

	return (
		<>
			<button onClick={handleQuery}> Query </button>
			<fieldset>
				{result.isSuccess && (
					<div>
						{JSON.stringify(result.data, (_, v) =>
							typeof v === 'bigint' ? v.toString() : v,
						).replace(/"/g, '')}
					</div>
				)}
				{result.isError && <div>{`Error: ${errorHandler.getErrorMessage(result.error)}`}</div>}
			</fieldset>
		</>
	);
}

export default ReadButton;
