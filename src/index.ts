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

import { getResseguroReport, getSeguroReport } from './api';
import { resseguroConfig, seguroConfig } from './configs';

export default {
	async fetch(request): Promise<Response> {

		if (request.method === 'OPTIONS') { 
			return new Response(null, {
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
					'Access-Control-Allow-Headers': '*',
				},
			});
		}
		
		let response = new Response('Invalid endpoint', { status: 404 });
		
		console.log('Request received: ', request.url, request.method);
		
		const url = new URL(request.url);
		if (url.pathname == '/resseguro') {
			if (request.method === 'GET') 
				response = new Response(JSON.stringify({ ...resseguroConfig }));

			if (request.method === 'POST') {
				const params = await request.json() as { company: string; type: '22A' | '22P' | '23'; month: string };
				const text = await getResseguroReport(params.company, params.month, params.type);
				response = new Response(text);
			}
		}

		else if (url.pathname == '/seguro') {
			if (request.method === 'GET') 
				response = new Response(JSON.stringify({ ...seguroConfig }));

			if (request.method === 'POST') {
				const params = await request.json() as { company: string; type: '22A' | '22P' | '23'; month: string };
				const text = await getSeguroReport(params.company, params.month, params.type);
				response = new Response(text);
			}
		}

		response.headers.set('Access-Control-Allow-Origin', '*'); // Allow all origins (for testing, be specific in production)
		response.headers.set('Access-Control-Allow-Methods', '*'); // Allowed methods
		response.headers.set('Access-Control-Allow-Headers', '*'); // Allow all origins (for testing, be specific in production)

		return response;
	},
} satisfies ExportedHandler<Env>;
