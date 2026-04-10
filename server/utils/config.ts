import "dotenv/config";

const PORT = process.env.PORT;

const ETHERSCAN_SECRET_KEY = process.env.ETHERSCAN_SECRET_KEY;
const ETHERSCAN_API = process.env.ETHERSCAN_API;

export default { PORT, ETHERSCAN_SECRET_KEY, ETHERSCAN_API }