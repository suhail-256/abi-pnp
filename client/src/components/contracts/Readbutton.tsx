import { useContract } from '../../context/ContractContext';
import { type FunctionType } from '../../schemas/function';
import { useReadContract } from 'wagmi';
import errorHandler from '../../utils/errorUtils';

interface ReadButtonProps {
	func: FunctionType;
	args: string[];
}

function ReadButton({ func, args }: ReadButtonProps) {
	const { contractAddress, abi } = useContract();
	const result = useReadContract({
		abi,
		address: contractAddress as `0x${string}`,
		functionName: func.name,
		args: args.length ? args : undefined,
		query: { enabled: false, retry: false },
	});

	const handleQuery = async () => {
		console.log(args);
		try {
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
