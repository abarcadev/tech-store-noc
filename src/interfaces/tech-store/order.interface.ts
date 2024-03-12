import { ResponseGetAllByOrderIdI } from "./order-detail.interface";

interface ParamsGetAllOrdersI {
    orderDate: string;
    customer : string;
    limit    : number;
    skip     : number;
}

interface ResponseGetAllOrdersI {
    data : ResponseGetAllOrdersDataI[],
    total: number;
}

interface ResponseGetAllOrdersDataI {
    id       : string;
    orderDate: string;
    customer : string;
    total    : number;
}

interface ResponseGetByIdOrderI {
    id          : string;
    orderDate   : string;
    customerId  : string;
    customerName: string;
    email       : string;
    total       : number;
    orderDetails: ResponseGetAllByOrderIdI[];
}

export {
    ParamsGetAllOrdersI,
    ResponseGetAllOrdersI,
    ResponseGetAllOrdersDataI,
    ResponseGetByIdOrderI,
}