import { Router } from 'express';
import ConverterController from './converter.controller';

const ConverterRouter = Router();

ConverterRouter.get('/:from/:to/:amount', ConverterController.getRoot);
ConverterRouter.get('/list', ConverterController.getList);

export default ConverterRouter;
