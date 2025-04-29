import { load } from 'cheerio';

import { baseURL, doGet, preProcessResponse } from './api';

export async function getBase(url: string) {
	console.log(`Requesting Base: ${url}`);
	const response = await doGet(url);

	console.log("Base Request: Success");
	const text = await response.text();
	const $ = load(text);

	preProcessResponse(response, $);
	return text;
}
