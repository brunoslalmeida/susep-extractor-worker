import { load, CheerioAPI } from 'cheerio';
import { createFormData, doPost, baseURL } from './api';

export async function getResseguroReport(company: string, month: string, type: '22A' | '22P' | '23') {
	const params = {
		'ctl00%24ContentPlaceHolder1%24edEmpresas': company,
		'ctl00%24ContentPlaceHolder1%24edDemonstracao': type,
		'ctl00%24ContentPlaceHolder1%24edMes': month,
		'ctl00%24ContentPlaceHolder1%24Button1': 'Processar',
	};

	console.log(`Requesting Report: ${type} to company ${company} for month ${month}`);
	const resopnse = await doPost(baseURL, createFormData(params, true));

	if (resopnse == null) return;

	console.log('Request Received');
	const text = await resopnse.text();
	const $ = load(text);

	return JSON.stringify(parseReport($));
}

function parseReport($: CheerioAPI) {
	const table = $('#ctl00_ContentPlaceHolder1_gvSaida tr');
	const reuslt = [];
	for (let i = 1; i < table.length; i++) {
		const row = <any>table[i];

		try{

			const name = row.children[1].children[0].data.trim();
			const value = row.children[2].children[0].data.trim();
			
			reuslt.push({ name, value });
		}catch (e){
			console.log("fail to process line: ", i)
		}
	}

	return reuslt;
}
