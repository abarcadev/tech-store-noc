interface ParamsGetAllCustomersI {
    customer : string;
    username : string;
    createdAt: string;
    limit    : number;
    skip     : number;
}

interface ResponseGetAllCustomersI {
    data : ResponseGetAllCustomersDataI[];
    total: number;
}

interface ResponseGetAllCustomersDataI {
    id      : string;
    customer: string;
    username: string;
    email   : string;
}

export {
    ParamsGetAllCustomersI,
    ResponseGetAllCustomersI,
    ResponseGetAllCustomersDataI
}