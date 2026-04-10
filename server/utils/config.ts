import "dotenv/config";

const PORT = process.env.PORT;

const ETHERSCAN_SECRET_KEY = process.env.ETHERSCAN_SECRET_KEY;

export default { PORT, ETHERSCAN_SECRET_KEY }