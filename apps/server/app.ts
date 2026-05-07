import express from 'express';
import contractRouter from './router/contractRouter';
import explainRouter from './router/explainRouter';
import middleware from './utils/middleware';
import cors from 'cors';

const app = express();

//! temporary, for testing purposes only
app.use(cors());

app.use(middleware.requestLogger);
app.use(express.static('dist'));
app.use(express.json());

app.use('/api', contractRouter);
app.use('/api', explainRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
