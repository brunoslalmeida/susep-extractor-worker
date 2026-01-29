import _resseguroConfig from './resseguro.json';
import _seguroConfig from './seguro.json';
import _demonstraticoConfig from './demonstrativo.json'

export const resseguroConfig: ResseguroConfig = {
  companies: _resseguroConfig.companies,
  types: _resseguroConfig.types.map(type => ({
	code: type.code as "22A" | "22P" | "23",
    value: type.value,
  }))
};

export const seguroConfig: SeguroConfig = {
    companies: _seguroConfig.companies,
    types: _seguroConfig.types.map(type => ({
      code: type.code as "22A" | "22P" | "23",
      value: type.value,
    }))
};

const corrente = new Date().getFullYear(); // 2026
const anoFinal = corrente - 1;

export const demonstracaoConfig: DemonstrativoConfig = {
  entities: _demonstraticoConfig.entity,
  types: _demonstraticoConfig.type,
  years: Array.from(
    { length: anoFinal - _demonstraticoConfig.year + 1 },
    (_, i) => _demonstraticoConfig.year + i
  );
}