import { useEffect, useState } from 'react';
import { useConnection, useDisconnect, useConnectors, useConnect } from 'wagmi';

function Connection() {
	const connection = useConnection();
	const { disconnect } = useDisconnect();
	const { connect, status, error } = useConnect();
	const connectors = useConnectors();
	const primaryAddress = String(connection.addresses?.[0] ?? '');
	const [copied, setCopied] = useState(false);

	const shortenAddress = (address: string) => {
		if (!address) return '';
		if (address.length <= 12) return address;
		return `${address.slice(0, 8)}...${address.slice(-6)}`;
	};

	const copyAddress = async () => {
		if (!primaryAddress) return;
		try {
			await navigator.clipboard.writeText(primaryAddress);
			setCopied(true);
		} catch (error) {
			console.error('Failed to copy address:', error);
		}
	};

	useEffect(() => {
		if (!copied) return;
		const timer = setTimeout(() => setCopied(false), 1400);
		return () => clearTimeout(timer);
	}, [copied]);

	if (connection.isConnected) {
		return (
			<div className="connected-badge">
				<span className={`copy-feedback ${copied ? 'copy-feedback--show' : ''}`}>Copied</span>
				<span
					className="connected-address"
					title="Click to copy address"
					onClick={copyAddress}
					role="button"
					tabIndex={0}
					onKeyDown={e => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							void copyAddress();
						}
					}}
				>
					{shortenAddress(primaryAddress)}
				</span>
				<button className="disconnect-btn" type="button" onClick={() => disconnect()}>
					Disconnect
				</button>
			</div>
		);
	} else {
		return (
			<div className="connectors-wrap">
				<div className="connectors-list">
					{connectors.map(connector => (
						<button
							className="connect-btn"
							key={connector.uid}
							onClick={() => connect({ connector })}
							type="button"
						>
							{connector.name}
						</button>
					))}
					{status && status !== 'idle' && <span className="connect-status">{status}</span>}
				</div>
				{error?.message && (
					<div className="error-alert connect-error">
						<span className="error-alert-icon" aria-hidden="true">
							!
						</span>
						<span>{error.message}</span>
					</div>
				)}
			</div>
		);
	}
}

export default Connection;
