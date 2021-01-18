import { Router } from 'express';

import ConverterRouter from './core/converter/converter.routes';

const RootRouter = Router();

RootRouter.get('/', (req, res) => res.send('NodeJS (Express) + TypeScript Server'));
RootRouter.use('/converter', ConverterRouter);
RootRouter.get('*', (req, res) => res.status(404).send('Endpoint not found'));

export default RootRouter;
