import express from "express";
import { getAbi } from "../controller/abiController";

const abiRouter = express.Router();

abiRouter.get("/", (req, res) => {
	res.json("init");
});

abiRouter.get("/:address/:chainId", (req, res) => getAbi(req, res));

export default abiRouter;
