import { useConnection, useDisconnect, useConnectors, useConnect } from 'wagmi';

function Connection() {
	const connection = useConnection();
	const { disconnect } = useDisconnect();
	const { connect, status, error } = useConnect();
	const connectors = useConnectors();

	if (connection.isConnected) {
		return (
			<div>
				<h2>Connected</h2>
				<div>Addresses: {connection.addresses}</div>
				<br />
				<button type="button" onClick={() => disconnect()}>
					Disconnect
				</button>
			</div>
		);
	} else {
		return (
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
		);
	}
}

export default Connection;
