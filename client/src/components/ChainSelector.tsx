import { useState, useRef, useEffect } from 'react';
import { useChains } from 'wagmi';
import { useContract } from '../context/ContractContext';

function ChainSelector() {
	const chains = useChains();
	const { selectedChainId, setSelectedChainId } = useContract();
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	const selectedChain = chains.find(c => c.id === selectedChainId);

	useEffect(() => {
		const onClickOutside = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener('mousedown', onClickOutside);
		return () => document.removeEventListener('mousedown', onClickOutside);
	}, []);

	const handleSelect = (chainId: number) => {
		setSelectedChainId(chainId);
		setOpen(false);
		console.log(`Chain: ${chainId}`);
	};

	return (
		<div className="chain-dropdown" ref={ref}>
			<button type="button" className="chain-trigger" onClick={() => setOpen(prev => !prev)}>
				<span className="chain-trigger-label">{selectedChain?.name ?? 'Chain'}</span>
				<svg
					className={`chain-trigger-chevron ${open ? 'chain-trigger-chevron--open' : ''}`}
					width="10"
					height="6"
					viewBox="0 0 10 6"
					fill="none"
				>
					<path
						d="M1 1L5 5L9 1"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>
			{open && (
				<ul className="chain-menu">
					{chains.map(chain => (
						<li
							key={chain.id}
							className={`chain-menu-item ${chain.id === selectedChainId ? 'chain-menu-item--active' : ''}`}
							onClick={() => handleSelect(chain.id)}
						>
							{chain.name}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default ChainSelector;
