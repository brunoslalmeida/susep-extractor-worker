import { load, CheerioAPI } from 'cheerio';
import { createFormData, doPost, baseURL } from './api';
import { getBase } from './base';

export async function getResseguroReport(company: string, month: string, type: ResseguroType) {
	const url = baseURL + 'menuestatistica/SES/balanco.aspx?tipo=resseglocal&id=55';
	await getBase(url);
	
	const params = {
		'ctl00%24ContentPlaceHolder1%24edEmpresas': company,
		'ctl00%24ContentPlaceHolder1%24edDemonstracao': type,
		'ctl00%24ContentPlaceHolder1%24edMes': month,
		'ctl00%24ContentPlaceHolder1%24Button1': 'Processar',
	};

	console.log(`Requesting Resseguro Report: ${type} to company ${company} for month ${month}`);
	const resopnse = await doPost(url, createFormData(params, true));

	if (resopnse == null) return;

	console.log('Request Received');
	const text = await resopnse.text();
	const $ = load(text);

	return JSON.stringify(parseResseguroReport($));
}

function parseResseguroReport($: CheerioAPI) {
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

export async function getSeguroReport(company: string, month: string, type: SeguroType){
	const url = baseURL + 'menuestatistica/SES/balanco.aspx?tipo=seg&id=14';
	try{
		await getBase(url);

		const params = {
			'ctl00%24ContentPlaceHolder1%24edEmpresas': company,
			'ctl00%24ContentPlaceHolder1%24edDemonstracao': type,
			'ctl00%24ContentPlaceHolder1%24edMes': month,
			'ctl00%24ContentPlaceHolder1%24Button1': 'Processar',
		};

		console.log(`Requesting Seguro Report: ${type} to company ${company} for month ${month}`);
		const resopnse = await doPost(url, createFormData(params, true));

		if (resopnse == null) return;

		console.log('Request Received');
		const text = await resopnse.text();
		const $ = load(text);
		
		return JSON.stringify(parseSeguroReport($));
	}catch (e){
		return JSON.stringify({ error: e instanceof Error ? e.message : 'An unknown error occurred' });
	}
}


function parseSeguroReport($: CheerioAPI) {
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