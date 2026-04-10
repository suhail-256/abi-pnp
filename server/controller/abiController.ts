import express from "express";
import config from "../utils/config";
import logger from "../utils/logger";

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
			ETHERSCAN_GET_CONTRACT_ABI_URL.replace("{chainId}", chainId).replace(
				"{address}",
				address,
			)
		);
		const data = await response.json();

		logger.info(data);
		// Check if the API returned an error
		if (data.status === "0") {
			return res.status(400).json({ error: data.result });
		}

		res.json(JSON.parse(data.result));
	} catch (err) {
		logger.error(err);
		next(err);
	}
};

export { getAbi };
