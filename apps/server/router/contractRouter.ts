import express from 'express';
import { getContractSource } from '../controller/contractController';

const contractRouter = express.Router();

contractRouter.get('/contract-source/:chainId/:address', getContractSource);

export default contractRouter;
