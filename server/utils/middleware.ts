import morgan from "morgan";
import express from "express";

const requestLogger = morgan(":method :url :status :response-time ms");

const unknownEndpoint = (req: express.Request, res: express.Response) => {
	res.status(404).json({
		error: "unknown endpoint",
	});
};

const errorHandler = (
	err: Error,
	req: express.Request,
	res: express.Response,
	next: express.NextFunction,
) => {
	if (err.name === "SyntaxError") {
		return res.status(400).json({ error: "Error: Invalid JSON" });
	}
	res.status(500).json({ error: "Internal Server Error" });
};

export default { requestLogger, unknownEndpoint, errorHandler };
