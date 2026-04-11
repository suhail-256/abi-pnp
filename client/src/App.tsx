import { useConnect, useConnection, useConnectors, useDisconnect } from 'wagmi'
import SearchField from './components/SearchField'
import { useEffect, useState } from 'react'
import { Abi } from './schemas/abi'
import { FunctionSchema, type FunctionType } from './schemas/function'
import FunctionsList from './components/FunctionsList'

function App() {
	const connection = useConnection()
	const { connect, status, error } = useConnect()
	const connectors = useConnectors()
	const { disconnect } = useDisconnect()

	const [abi, setAbi] = useState<Abi>()
	const [contractAddress, setContractAddress] = useState<string>()
	const [functions, setFunctions] = useState<FunctionType[]>()

	useEffect(() => {
		if (!abi) return

		const parsedFunctions = FunctionSchema.array().safeParse(extractFunctions(abi))
		if (!parsedFunctions.success) {
			console.error('Error parsing functions:', parsedFunctions.error)
			return
		}
		setFunctions(parsedFunctions.data)
		console.log(parsedFunctions.data)
	}, [abi])

	const extractFunctions = (abi: Abi) => {
		const extractedFunctions = abi.filter(item => {
			return item.type === 'function'
		})
		return extractedFunctions
	}

	return (
		<>
			<div>
				<h2>Connection</h2>

				<div>
					status: {connection.status}
					<br />
					addresses: {JSON.stringify(connection.addresses)}
					<br />
					chainId: {connection.chainId}
				</div>

				{connection.status === 'connected' && (
					<button type="button" onClick={() => disconnect()}>
						Disconnect
					</button>
				)}
			</div>

			<div>
				<h2>Connect</h2>
				{connectors.map(connector => (
					<button key={connector.uid} onClick={() => connect({ connector })} type="button">
						{connector.name}
					</button>
				))}
				<div>{status}</div>
				<div>{error?.message}</div>
			</div>
			<SearchField setContractAddress={setContractAddress} setAbi={setAbi} />
			<FunctionsList functions={functions} />
		</>
	)
}

export default App
