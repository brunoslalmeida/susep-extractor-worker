import _resseguroConfig from './resseguro.json';
import _seguroConfig from './seguro.json';
import _demonstraticoConfig from './demonstrativo.json';

export const resseguroConfig: ResseguroConfig = {
	companies: _resseguroConfig.companies,
	types: _resseguroConfig.types.map((type) => ({
		code: type.code as '22A' | '22P' | '23',
		value: type.value,
	})),
};

export const seguroConfig: SeguroConfig = {
	companies: _seguroConfig.companies,
	types: _seguroConfig.types.map((type) => ({
		code: type.code as '22A' | '22P' | '23',
		value: type.value,
	})),
};

const YEAR = 2011;
const length = Math.max(0, new Date().getFullYear() - YEAR);
const years = Array.from({ length }, (_, i) => YEAR + i);

export const demonstracaoConfig: DemonstrativoConfig = {
	entities: _demonstraticoConfig.entity,
	types: _demonstraticoConfig.type,
	years,
};
