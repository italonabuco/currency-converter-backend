import express from 'express';

export type T_ConverterGetListSignature = (
	req: express.Request,
	res: express.Response<{ codes: string[] }>
) => express.Response;

type T_ConverterGetRootRequest = express.Request<{ from: string; to: string; amount: string }, any, any, any>;

export type T_ConverterGetRootSignature = (
	req: T_ConverterGetRootRequest,
	res: express.Response<
		{ from: string; to: string; rate: number; response: number; date: string } | { errors: string[] }
	>
) => Promise<express.Response>;
