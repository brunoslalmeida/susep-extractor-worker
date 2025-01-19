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
		let response;

		if (request.method === 'GET') {
			response = await getConfigs();
		} else {
			response = await getItems(request);
		}

		// response.headers.set('Access-Control-Allow-Origin', 'https://susep-extractor-angular.pages.dev'); // Allow all origins (for testing, be specific in production)
		response.headers.set('Access-Control-Allow-Origin', '*'); // Allow all origins (for testing, be specific in production)
		response.headers.set('Access-Control-Allow-Methods', 'GET, POST'); // Allowed methods
		response.headers.set('Access-Control-Allow-Headers', '*'); // Allow all origins (for testing, be specific in production)

		return response;

		function monthDiff(d1: Date, d2: Date) {
			var months;
			months = (d2.getFullYear() - d1.getFullYear()) * 12;
			months -= d1.getMonth();
			months += d2.getMonth();
			return (months <= 0 ? 0 : months) + 1;
		}

		async function getItems(request: Request<unknown, IncomingRequestCfProperties<unknown>>): Promise<Response> {
			const params = await request.json<{ company: string; type: string; start: Date; end: Date }>();

			const types = <'22A' | '22P' | '23'[]>[];
			if (params.type === 'Todos') {
				types.push(...data.types.map((e) => e.code));
			} else {
				types.push(params.type);
			}

			console.log('types: ', types);
			console.log('start: ', params.start);

			const months = monthDiff(new Date(params.start), new Date(params.end));
			console.log('months: ', months);

			const req = await fetch(url, {
				headers: {
					Host: 'https://www2.susep.gov.br',
					Origin: 'https://www2.susep.gov.br',
					Referer: 'https://www2.susep.gov.br/menuestatistica/SES/balanco.aspx?tipo=seg&id=14',
					Accept:
						'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
					'User-Agent':
						'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.160 Safari/537.36',
					'Sec-Fetch-Site': 'same-origin',
					'Sec-Fetch-Mode': 'navigate',
					'Sec-Fetch-User': '?1',
					'Sec-Fetch-Dest': 'document',
					'Cache-Control': 'max-age=0',
					'Sec-Ch-Ua': '"Chromium";v="121", "Not A(Brand";v="99"',
					'Sec-Ch-Ua-Mobile': '?0',
					'Sec-Ch-Ua-Platform': '"Linux"',
				},
			});
			const cookie = req.headers
				.getSetCookie()[0]
				.split(';')
				.filter((e) => e.startsWith('ASP.NET'))[0]
				.trim();
			const $ = cheerio.load(await req.text());

			const formData = {
				viewState: (<any>$('#__VIEWSTATE'))[0].attribs.value,
				eventValidation: (<any>$('#__EVENTVALIDATION'))[0].attribs.value,
				viewStateGenerator: (<any>$('#__VIEWSTATEGENERATOR'))[0].attribs.value,
			};

			return getData(formData, params.company, types[2], '202409', cookie);
			// for (let count = 0; count < months; count++){
			// 	types.forEach(type => {
			// 		const company = params.company
			// 	});
			// }
		}

		async function getData(data: any, comapny: string, type: '22A' | '22P' | '23', date: string, cookie: string): Promise<Response> {
			let body: string = `__VIEWSTATE=${encodeURIComponent(data.viewState)}&`;
			body += `__EVENTVALIDATION=${encodeURIComponent(data.eventValidation)}&`;
			body += `__VIEWSTATEGENERATOR=${encodeURIComponent(data.viewStateGenerator)}&`;
			body += `ctl00%24ContentPlaceHolder1%24edEmpresas=${comapny}&`;
			body += `ctl00%24ContentPlaceHolder1%24edDemonstracao=${type}&`;
			body += `ctl00%24ContentPlaceHolder1%24edMes=${date}&`;
			body += `ctl00%24ContentPlaceHolder1%24Button1=Processar`;

			const req = await fetch(url, {
				body: body,
				method: 'POST',
				headers: {
					Cookie: cookie,
					Host: 'https://www2.susep.gov.br',
					Origin: 'https://www2.susep.gov.br',
					Referer: 'https://www2.susep.gov.br/menuestatistica/SES/balanco.aspx?tipo=seg&id=14',
					Accept:
						'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
					'User-Agent':
						'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.160 Safari/537.36',
					'Content-Type': 'application/x-www-form-urlencoded',
					'Sec-Fetch-Site': 'same-origin',
					'Sec-Fetch-Mode': 'navigate',
					'Sec-Fetch-User': '?1',
					'Sec-Fetch-Dest': 'document',
					'Cache-Control': 'max-age=0',
					'Sec-Ch-Ua': '"Chromium";v="121", "Not A(Brand";v="99"',
					'Sec-Ch-Ua-Mobile': '?0',
					'Sec-Ch-Ua-Platform': '"Linux"',
				},
			});

			const $ = cheerio.load(await req.text());

			return new Response(await req.text());
		}

		async function getConfigs(): Promise<Response> {
			const { companies, types } = data;
			return new Response(JSON.stringify({ companies, types }));
		}
	},
} satisfies ExportedHandler<Env>;

