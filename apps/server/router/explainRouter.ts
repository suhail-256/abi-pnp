import express from 'express';
import { explainFunction } from '../controller/explainController';
const explainRouter = express.Router();

explainRouter.post('/explain', explainFunction);

export default explainRouter;
