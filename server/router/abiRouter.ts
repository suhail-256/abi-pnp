import express from "express";

const abiRouter = express.Router();

abiRouter.get("/", (req, res) => {
	res.json("init");
});

export default abiRouter;
