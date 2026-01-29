interface SeguroConfig {
    companies: {
        code: string;
        name: string;   
    }[];
    types: {
        code: '22A' | '22P' | '23';
        value: string;
    }[];
}

type SeguroType =  "22A" | "22P" | "23"

interface ResseguroConfig {
    companies: {
        code: string;
        name: string;   
    }[];
    types: {
        code: ResseguroType
        value: string;
    }[];
}

type ResseguroType =  "22A" | "22P" | "23"

interface DemonstrativoConfig {
    types: {
        code: string;
        value: string;
    }[];
}
