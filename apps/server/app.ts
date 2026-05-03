import express from 'express';
import contractRouter from './router/contractRouter';
import middleware from './utils/middleware';

const app = express();

app.use(middleware.requestLogger);
app.use(express.static('dist'));
app.use(express.json());

app.use('/api', contractRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
