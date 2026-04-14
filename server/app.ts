import express from "express";
import abiRouter from "./router/abiRouter";
import middleware from "./utils/middleware";

const app = express();

app.use(middleware.requestLogger);
app.use(express.static("dist"));
app.use(express.json());

app.use("/api", abiRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
