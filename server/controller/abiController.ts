import { Request, Response } from "express";
import config from "../utils/config";
import logger from "../utils/logger";

const getAbi = async (req: Request, res: Response) => {
	const chainId = req.params.chainId;
	const address = req.params.address;

	const options = { method: "GET" };
	try {
		const response = await fetch(
			`https://api.etherscan.io/v2/api?apikey=${config.ETHERSCAN_SECRET_KEY}&chainid=${chainId}&address=${address}&module=contract&action=getabi`,
			options,
		);
		const data = await response.json();

		logger.info(JSON.parse(data.result));

		res.json(JSON.parse(data.result));
	} catch (err) {
		logger.error(err);
		throw new Error("Failed to fetch ABI!");
	}
};

export { getAbi };
