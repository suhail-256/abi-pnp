import express from 'express';
import config from '../utils/config';
import logger from '../utils/logger';
import { createPublicClient, http, fallback, type Address, type Chain } from 'viem';
import * as supportedChains from '../utils/chains';

const ETHERSCAN_GET_CONTRACT_ABI_URL = `https://api.etherscan.io/v2/api?apikey=${config.ETHERSCAN_SECRET_KEY}&chainid={chainId}&address={address}&module=contract&action=getabi`;

const getAbi = async (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction,
) => {
	const chainId = req.params.chainId as string;
	const address = req.params.address as string;

	try {
		const response = await fetch(
			ETHERSCAN_GET_CONTRACT_ABI_URL.replace('{chainId}', chainId).replace(
				'{address}',
				address,
			),
		);
		const data = await response.json();

		logger.info(data);
		// Check if the API returned an error
		if (data.status === '0') {
			return res.status(400).json({ error: data.result });
		}

		res.json(JSON.parse(data.result));
	} catch (err) {
		next(err);
	}
};

const isContract = async (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction,
) => {
	const chainId = req.params.chainId as string;
	const address = req.params.address as string;

	const chain =
		chainId === '1'
			? supportedChains.mainnet
			: (Object.values(supportedChains).find(c => c.id === Number(chainId)) as Chain);

	const publicClient = createPublicClient({
		chain: chain as Chain,
		transport: fallback([
			http('https://cloudflare-eth.com'),
			http('https://rpc.ankr.com/eth'),
			http(),
		]),
	});
	try {
		const bytecode = await publicClient.getCode({ address: address as Address });
		if (!bytecode || bytecode === '0x') {
			return res.status(404).json({ error: 'No contract found at this address' });
		}
		res.json({ isContract: true });
	} catch (err) {
		next(err);
	}
};

export { getAbi, isContract };
