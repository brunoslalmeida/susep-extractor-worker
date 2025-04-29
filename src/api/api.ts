import { CheerioAPI } from 'cheerio';

const domain = 'www2.susep.gov.br';
export const baseURL = `https:/${domain}/`;

let cookie: string | null = null;

const formSecure = {
	viewState: null,
	eventValidation: null,
	viewStateGenerator: null,
};

const headers = {
	Cookie: '',
	Host: domain,
	Origin: baseURL,
	Accept:
		'text/html,application/xhtml+xml,application/xml,q=0.9,image/avif,image/webp,image/apng,*/*,q=0.8,application/signed-exchange,v=b3,q=0.7',
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0, Win64, x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.160 Safari/537.36',
		'Sec-Fetch-Site': 'same-origin',
		'Sec-Fetch-Mode': 'navigate',
		'Sec-Fetch-User': '?1',
		'Sec-Fetch-Dest': 'document',
		'Cache-Control': 'max-age=0',
		'Sec-Ch-Ua': '"Chromium",v="121", "Not A(Brand",v="99"',
		'Sec-Ch-Ua-Mobile': '?0',
		'Sec-Ch-Ua-Platform': '"Linux"',
};

export async function doGet(url: string) {
	return fetch(url, { method: 'GET', headers: {...headers, Referer: url} });
}

export async function doPost(url: string, body: string) {
	if (!cookie) {
		console.log('Post must note be request before collecting a cookie');
		return null;
	}

	return fetch(url, { body, method: 'POST', headers: { ...headers, Referer: url,  'Content-Type': 'application/x-www-form-urlencoded' } });
}

export async function preProcessResponse(response: Response, $: CheerioAPI) {
	if (!cookie) {
		const cookies = response.headers.getSetCookie();

		if (cookies.length > 0) {
			const _cookie = cookies[0];
			if (_cookie.includes('ASP.NET')) {
				cookie = _cookie
					.split(';')
					.filter((e) => e.startsWith('ASP.NET'))[0]
					.trim();

				headers.Cookie = cookie;
				console.log('Cookie collected');
			}
		}
	}

	if (!formSecure.viewState) {
		console.log('formSecure collected');

		updateElement($, '#__VIEWSTATE', 'viewState');
		updateElement($, '#__EVENTVALIDATION', 'eventValidation');
		updateElement($, '#__VIEWSTATEGENERATOR', 'viewStateGenerator');
	}
}

export function createFormData(data: { [key: string]: string }, addSecure?: boolean): string {
	let formData = '';

	if (addSecure && formSecure.viewState) formData += `__VIEWSTATE=${encodeURIComponent(formSecure.viewState)}&`;
	if (addSecure && formSecure.eventValidation) formData += `__EVENTVALIDATION=${encodeURIComponent(formSecure.eventValidation)}&`;
	if (addSecure && formSecure.viewStateGenerator) formData += `__VIEWSTATEGENERATOR=${encodeURIComponent(formSecure.viewStateGenerator)}&`;

	Object.keys(data).forEach((key, index, arr) => (formData += `${key}=${data[key]}${index === arr.length - 1 ? '' : '&'}`));

	return formData;
}

function updateElement($: CheerioAPI, id: string, name: 'viewState' | 'eventValidation' | 'viewStateGenerator') {
	const element = $(id);
	if (element.length > 0) {
		const value = (<any>element[0]).attribs.value;
		formSecure[name] = value;
	}
}
