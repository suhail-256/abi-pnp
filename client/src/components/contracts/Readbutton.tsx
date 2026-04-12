import { useContract } from '../../context/ContractContext';
import {
	type AbiFunction,
	AbiSchema,
	AbiParameterSchema,
} from '../../types/contract';
import { useReadContract } from 'wagmi';
import errorHandler from '../../utils/errorUtils';

interface ReadButtonProps {
	func: AbiFunction;
	args: string[];
}

function ReadButton({ func, args }: ReadButtonProps) {
	const { contractAddress, abi } = useContract();

	const parseArgs = (args: string[]) => {
		return args.map((arg, index) => {
			if (arg === undefined) return undefined;
			try {
				// for array type, split by comma and trim spaces
				if (func.inputs![index].type.endsWith(']')) {
					return arg.split(',').map(item => item.trim());
				}
				return arg;
			} catch (error) {
				console.error(`Error parsing arguments: ${error}`);
				console.log(args.length);
				return arg;
			}
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
