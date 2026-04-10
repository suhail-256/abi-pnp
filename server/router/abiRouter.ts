import express from "express";
import { getAbi } from "../controller/abiController";

const abiRouter = express.Router();

abiRouter.get("/:chainId/:address", getAbi);

export default abiRouter;
