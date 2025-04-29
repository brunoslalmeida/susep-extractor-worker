import _resseguroConfig from './resseguro.json';
import _seguroConfig from './seguro.json';

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