import express from 'express';
import { getContractSource, isContract } from '../controller/contractController';

const contractRouter = express.Router();

contractRouter.get('/contract-source/:chainId/:address', getContractSource);
contractRouter.get('/is-contract/:chainId/:address', isContract);

export default contractRouter;
