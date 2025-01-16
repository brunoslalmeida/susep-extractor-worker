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
import * as cheerio from 'cheerio';

export default {
	async fetch(request, env, ctx): Promise<Response> {
		let response;

		if (request.method === 'GET') {
			response = await getConfigs();
		}

		response = await getItems();

		response.headers.set('Access-Control-Allow-Origin', '*'); // Allow all origins (for testing, be specific in production)
		response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allowed methods
		response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers

		return response;

		async function getItems(): Promise<Response> {
			return new Response('Other Request');
		}

		async function getConfigs(): Promise<Response> {
			const url = 'https://www2.susep.gov.br/menuestatistica/SES/balanco.aspx?tipo=seg&id=14';
			const req = await fetch(url);
			const $ = cheerio.load(await req.text());
			const a = $('#ctl00_ContentPlaceHolder1_edEmpresas option');

			const companies = [];

			for (let i = 0; i < a.length; i++) {
				const element = a[i];
				const code = element.attribs.value.trim();
				let name = <string>(<any>element.children[0]).data;
				if (name.includes(' - ')) name = name.split(' - ')[1].trim();
				companies.push({ code, name });
			}

			const b = $('#ctl00_ContentPlaceHolder1_edDemonstracao option');
			const types = [];
			for (let i = 0; i < b.length; i++) {
				const element = b[i];
				const code = element.attribs.value.trim();
				const value = <string>(<any>element.children[0]).data;
				types.push({
					code,
					value,
				});
			}

			return new Response(
				JSON.stringify({
					companies,
					types,
				})
			);
		}
	},
} satisfies ExportedHandler<Env>;
