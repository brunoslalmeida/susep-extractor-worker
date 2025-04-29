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