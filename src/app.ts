import express from 'express';
import cors from 'cors';
import RootRouter from './routes';

class AppController {
	express;
	constructor() {
		this.express = express();

		this.middlewares();
		this.routes();
	}

	middlewares() {
		const corsOpts = {
			origin: '*',
			methods: [ 'GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'OPTIONS' ],
			allowedHeaders: [ 'Content-Type', 'Authorization' ]
		};
		this.express.use(cors(corsOpts));
		this.express.use(express.json());
	}

	routes() {
		this.express.use(RootRouter);
	}
}

export default AppController;
