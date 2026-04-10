import express from "express";
import abiRouter from "./router/abiRouter";

const app = express();

app.use(express.static("dist"));
app.use(express.json());

app.use("/", abiRouter);
export default app;
