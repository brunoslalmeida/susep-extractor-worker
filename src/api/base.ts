import { load } from 'cheerio';

import { baseURL, doGet, preProcessResponse } from './api';

export async function getBase() {
	const response = await doGet(baseURL);

	console.log("Base Request: Success");
	const text = await response.text();
	const $ = load(text);

	preProcessResponse(response, $);
	return text;
}
