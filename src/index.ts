/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { getBase, getResseguroReport } from './api';
import { params } from './config';

export default {
	async fetch(request): Promise<Response> {
		let response = new Response('');

		if (request.method === 'GET') response = await returnParams();

		if (request.method === 'POST') {
			const url = new URL(request.url);

			if (url.pathname == '/resseguro') {
				const params = await request.json<{ company: string; type: '22A' | '22P' | '23'; month: string }>();
				response = await returnResseguroReport(params);
			}
			else if (url.pathname == '/seguro') {
				response = new Response('Invalid Not Implemented YET', { status: 404 });

			}
			else {
				response = new Response('Invalid endpoint', { status: 404 });
			}
		}

		// response.headers.set('Access-Control-Allow-Origin', 'https://susep-extractor-angular.pages.dev'); // Allow all origins (for testing, be specific in production)
		response.headers.set('Access-Control-Allow-Origin', '*'); // Allow all origins (for testing, be specific in production)
		response.headers.set('Access-Control-Allow-Methods', '*'); // Allowed methods
		response.headers.set('Access-Control-Allow-Headers', '*'); // Allow all origins (for testing, be specific in production)

		return response;

		async function returnParams(): Promise<Response> {
			return new Response(JSON.stringify({ ...params }));
		}

		async function returnResseguroReport(params: { company: string; type: '22A' | '22P' | '23'; month: string }): Promise<Response> {
			await getBase(); //Make sure to have cookie

			const text = await getResseguroReport(params.company, params.month, params.type);

			return new Response(text);
		}
	},
} satisfies ExportedHandler<Env>;
