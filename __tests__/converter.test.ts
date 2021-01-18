import supertest from 'supertest';
import fetchMockJest from 'fetch-mock-jest';
import AppController from '../src/app';
import vars from '../src/vars';

// mocking node-fetch
jest.mock('node-fetch', () => fetchMockJest.sandbox());
const fetchMock = require('node-fetch');

const app = new AppController().express;
const request = supertest(app);

describe('GET /converter/list', () => {
	it('should return list of available currencies', async () => {
		const res = await request.get(`/converter/list`).expect(200);
		expect(res.body).toEqual({ codes: vars.availableCurrencies });
	});
});
describe('GET /converter/:from/:to/:amount', () => {
	const testCurrency = (name: 'from' | 'to', lengthCase: string, numberCase: string, unavailableCase: string) => {
		describe(`'${name}' param should be a available 3-letter code`, () => {
			it('should have string length equal to 3', async () => {
				const res = await request.get(`/converter${lengthCase}`).expect(400);
				expect(res.body.errors).toContain(`'${name}' should have string length equal to 3`);
			});
			it('should contain only letters', async () => {
				const res = await request.get(`/converter${numberCase}`).expect(400);
				expect(res.body.errors).toContain(`'${name}' should contain only letters`);
			});
			it('should be a available code', async () => {
				const res = await request.get(`/converter${unavailableCase}`).expect(400);
				expect(res.body.errors).toContain("'aaa' is not a currency option");
			});
		});
	};

	describe('Checking params: from, to and amount', () => {
		testCurrency('from', '/K/USD/140.0', '/1Ab/USD/14a.0', '/aaa/USD/140.0');
		testCurrency('to', '/USD/k/10.01', '/USD/1Ab/14.0.3', '/USD/aaa/140.0');
		describe("'amount' should be a non-negative number", () => {
			const error = "'amount' should be a valid non-negative number";
			it('should not contain letter', async () => {
				const res = await request.get(`/converter/K/USD/1a0.0`).expect(400);
				expect(res.body.errors).toContain(error);
			});
			it('should contain at most one point', async () => {
				const res = await request.get(`/converter/K/USD/1.0.0`).expect(400);
				expect(res.body.errors).toContain(error);
			});
			it('should not container anything different from a digit or a point', async () => {
				const res = await request.get(`/converter/K/USD/189a,0.0`).expect(400);
				expect(res.body.errors).toContain(error);
			});
			it('should not be a negative number', async () => {
				const res = await request.get(`/converter/K/USD/-10.0`).expect(400);
				expect(res.body.errors).toContain(error);
			});
		});
	});

	it('should return correct response', async () => {
		const from = 'USD';
		const to = 'EUR';
		const value = 2;
		const rate = 0.82;
		const response = 1.64;
		const timestamp = 1610910023;
		const date = new Date().toLocaleString();
		// const getUrl = `https://openexchangerates.org/api/latest.json?app_id=${vars.openexchangerates_key}&base=${from}&symbols=${to}`;
		const getUrl = `https://api.exchangeratesapi.io/latest?base=${from}&symbols=${to}`;
		fetchMock.get(getUrl, {
			fullDate: date,
			base: from,
			rates: { [to]: rate }
		});
		const res = await request.get(`/converter/${from}/${to}/${value}`).expect(200);
		expect(fetchMock).toHaveLastFetched(getUrl, 'get');

		expect(res.body).toEqual({
			from,
			to,
			rate,
			response,
			date
		});
	});
});
