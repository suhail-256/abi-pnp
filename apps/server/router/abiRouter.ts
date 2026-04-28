import express from "express";
import { getAbi, isContract } from "../controller/abiController";

const abiRouter = express.Router();

abiRouter.get("/abi/:chainId/:address", getAbi);
abiRouter.get("/is-contract/:chainId/:address", isContract);

export default abiRouter;
