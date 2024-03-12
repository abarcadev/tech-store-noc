interface ParamsGetAllProductsI {
    name     : string;
    createdAt: string;
    limit    : number;
    skip     : number;
}

interface ResponseGetAllProductsI {
    data : ResponseGetAllProductsDataI[];
    total: number;
}

interface ResponseGetAllProductsDataI {
    id         : number;
    name       : string;
    description: string;
    price      : number;
}

export {
    ParamsGetAllProductsI,
    ResponseGetAllProductsI,
    ResponseGetAllProductsDataI,
};