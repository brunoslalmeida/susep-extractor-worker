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

export default {
	async fetch(request, env, ctx): Promise<Response> {
		if (request.method === 'GET') {
			return getConfigs();
		}

		return getItems();

		async function getItems(): Promise<Response> {
			return new Response('Other Request');
		}

		async function getConfigs(): Promise<Response> {
			const url = 'https://www2.susep.gov.br/menuestatistica/SES/balanco.aspx?tipo=seg&id=14';
			const req = await fetch(url);

			return new Response(
				JSON.stringify({
					company: [{ code: '05495', name: 'ZURICH MINAS BRASIL SEGUROS S.A.' }],
				})
			);
		}
	},
} satisfies ExportedHandler<Env>;
