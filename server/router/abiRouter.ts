import express from "express";
import { getAbi } from "../controller/abiController";

const abiRouter = express.Router();

abiRouter.get("/:address/:chainId", (req, res, next) => getAbi(req, res, next));

export default abiRouter;
