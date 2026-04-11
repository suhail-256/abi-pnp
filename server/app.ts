import express from "express";
import abiRouter from "./router/abiRouter";
import middleware from "./utils/middleware";
import cors from 'cors'

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
}))

app.use(middleware.requestLogger);
app.use(express.static("dist"));
app.use(express.json());

app.use("/api/abi", abiRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
