import { T_ConverterGetListSignature, T_ConverterGetRootSignature } from './converter.types';
import fetch from 'node-fetch';
import vars from '../../vars';

class ConverterClass {
	getList: T_ConverterGetListSignature = function(req, res) {
		return res.status(200).json({ codes: vars.availableCurrencies });
	};

	getRoot: T_ConverterGetRootSignature = async function(req, res) {
		try {
			const { to, from, amount } = req.params;
			const errors: string[] = [];

			// errors handlers
			const checkCurrencyCode = function(name: 'from' | 'to', currencyCode: string) {
				if (currencyCode.length !== 3) {
					errors.push(`'${name}' should have string length equal to 3`);
				}
				if (!/^[a-zA-Z]+$/.test(currencyCode)) {
					errors.push(`'${name}' should contain only letters`);
				}
				if (!vars.availableCurrencies.find((avCode) => avCode === currencyCode.toUpperCase())) {
					errors.push(`'${currencyCode}' is not a currency option`);
				}
			};

			checkCurrencyCode('from', from);
			checkCurrencyCode('to', to);
			const amountNumber = new Number(amount);
			if (amountNumber.toString() === 'NaN' || amountNumber < 0) {
				errors.push("'amount' should be a valid non-negative number");
			}

			if (errors.length > 0) {
				throw errors;
			}

			try {
				if (to.toUpperCase() === from.toUpperCase()) {
					return res.status(200).json({
						from,
						to,
						date: new Date().toLocaleString(),
						response: parseFloat(parseFloat(amount).toFixed(4)),
						rate: 1
					});
				}
				const data = await fetch(
					// `https://openexchangerates.org/api/latest.json?app_id=${vars.openexchangerates_key}&base=${from}&symbols=${to}`
					`https://api.exchangeratesapi.io/latest?base=${from}&symbols=${to}`
				).then((res) => res.json());
				data.fullDate = new Date().toLocaleString();

				const rate = data.rates[to.toUpperCase()];
				return res.status(200).json({
					from,
					to,
					date: data.fullDate,
					response: parseFloat((parseFloat(amount) * rate).toFixed(4)),
					rate
				});
			} catch (error) {
				return res.status(400).json({ errors: [ error.message || 'Something gone wrong. Try again later.' ] });
			}
		} catch (error) {
			return res.status(400).json({ errors: error });
		}
	};
}

const ConverterController = new ConverterClass();

export default ConverterController;
