import {
    CUSTOMERS,
    LOGIN,
    PARAMETERS,
    PRODUCTS
} from "../config/endpoints-tech-store";
import { env } from "../config/environment";
import { 
    appendFileAdapter, 
    createFolderAdapter, 
    readFileB64Adapter, 
    sendEmailAdapter, 
    writeFileAdapter 
} from "../config/plugins";
import { MIMETypesEnum } from "../enums/mime-type.enum";
import { AttachmentsI, SendEmailOptionsI } from "../interfaces/send-email.interface";
import {
    APIPayloadParams,
    APIPayloadSave,
    LoginBodyI,
    ParamBodyI,
    ParamsGetAllCustomersI,
    ParamsGetAllProductsI,
    ResponseGetAllCustomersDataI,
    ResponseGetAllCustomersI,
    ResponseGetAllProductsDataI,
    ResponseGetAllProductsI,
    ResponseGetParamByNameI,
    ResponseLoginI
} from "../interfaces/tech-store";
import { ApiService } from "../services/tech-store/api.service";
import { getCurrentDate } from "../utils/functions";
import { 
    EMAIL_ADS_HTML_PRODUCTS,
    EMAIL_SIGNATURE,
    EMAIL_ADS_SUBJECT_PRODUCTS,
    PRODUCTS_LIST_FILE_HEADER 
} from "../utils/messages";

export class ProductAdsController {

    private readonly productsAdsPath = 'ads/products';
    
    constructor() {}

    async createAdvertising() {
        try {
            const { 
                token,
                products, 
                customers,
                lastDateProductAd 
            } = await this.getData();

            if (products.length > 0) {
                this.createFileProducts(products, lastDateProductAd!);
                await this.sendEmail(customers, lastDateProductAd!);
                await this.updateParamDateProductAd(token);
                    
                console.log(`Products Advertising sent for date created since: ${ lastDateProductAd }`);
            }
        } catch (error) {
            throw error;
        }
    }

    async getData() {
        try {
            const token             = await this.getLogin();
            const lastDateProductAd = await this.getParamByName(token, 'last_date_product_advertising');
            const products          = await this.getAllProducts(token, lastDateProductAd!);
            const customers         = await this.getAllCustomers(token);

            return {
                token,
                products,
                customers,
                lastDateProductAd
            };
        } catch (error: any) {
            throw error;
        }
    }

    private async getLogin() {
        try {
            const body: LoginBodyI = {
                username: env.APP_USER,
                password: env.APP_USER_PASSWORD
            };

            const payload: APIPayloadSave<LoginBodyI> = {
                url: `${ env.URL_API }/${ LOGIN }`,
                body
            };

            const { token } = await ApiService.login<LoginBodyI, ResponseLoginI>(payload);

            return token;
        } catch (error) {
            throw error;
        }
    }

    private async getParamByName(token: string, paramName: string) {
        try {
            const payload: APIPayloadParams<null> = {
                url  : `${ env.URL_API }/${ PARAMETERS }`,
                token,
                id   : paramName
            };

            const { textValue } = await ApiService.getById<null, ResponseGetParamByNameI>(payload);

            return textValue;
        } catch (error) {
            throw error;
        }
    }

    private async getAllProducts(token: string, createdAt: string) {
        try {
            const query: ParamsGetAllProductsI = {
                name     : '',
                createdAt,
                limit    : 100,
                skip     : 0
            };

            const payload: APIPayloadParams<ParamsGetAllProductsI> = {
                url: `${ env.URL_API }/${ PRODUCTS }`,
                token,
                query
            };

            const { data } = await ApiService.getAll<ParamsGetAllProductsI, ResponseGetAllProductsI>(payload);

            return data;
        } catch (error: any) {
            throw error;
       }
    }

    private async getAllCustomers(token: string) {
        try {
            const query: ParamsGetAllCustomersI = {
                customer : '',
                username : '',
                createdAt: '',
                limit    : 100,
                skip     : 0
            };

            const payload: APIPayloadParams<ParamsGetAllCustomersI> = {
                url: `${ env.URL_API }/${ CUSTOMERS }`,
                token,
                query
            };

            const { data } = await ApiService.getAll<ParamsGetAllCustomersI, ResponseGetAllCustomersI>(payload);

            const customers = data.filter((elem: ResponseGetAllCustomersDataI) => elem.username !== env.APP_USER);
            
            return customers;
        } catch (error) {
            throw error;
        }
    }

    async updateParamDateProductAd(token: string) {
        try {
            const body: ParamBodyI = {
                textValue   : getCurrentDate(),
                numericValue: null
            };

            const payload: APIPayloadSave<ParamBodyI> = {
                url: `${ env.URL_API }/${ PARAMETERS }`,
                body,
                token,
                id : 'last_date_product_advertising'
            }; 

            await ApiService.patch<ParamBodyI, null>(payload);
        } catch (error) {
            throw error;
        }
    }

    async createFileProducts(products: ResponseGetAllProductsDataI[], createdAt: string) {
        const destination = this.productsAdsPath;
        createFolderAdapter(destination);

        const fileName = `${ destination }/${ createdAt }.txt`;

        const content = PRODUCTS_LIST_FILE_HEADER(createdAt);

        writeFileAdapter(fileName, content);

        products.forEach((elem) => {
            const product = `${ elem.name.padEnd(49, ' ') } ${ elem.price }`;
            appendFileAdapter(fileName, `${ product }\n`);
        });
    }

    async sendEmail(customers: ResponseGetAllCustomersDataI[], fileName: string) {
        try {
            const customersEmail = customers.map((elem) => elem.email);

            const logoTechStore: AttachmentsI = {
                content    : readFileB64Adapter(`${ env.LOCAL_FILE_FOLDER }/${ env.TECH_STORE_LOGO }`),
                filename   : 'logo.jpg',
                type       : MIMETypesEnum.jpg,
                disposition: 'attachment'
            };

            const productsList: AttachmentsI = {
                content    : readFileB64Adapter(`${ this.productsAdsPath }/${ fileName }.txt`),
                filename   : 'lista.txt',
                type       : MIMETypesEnum.txt,
                disposition: 'attachment'
            };

            const attachments: AttachmentsI[] = [ logoTechStore, productsList ];

            const emailOptions: SendEmailOptionsI = {
                to     : customersEmail,
                subject: EMAIL_ADS_SUBJECT_PRODUCTS,
                html   : `${ EMAIL_ADS_HTML_PRODUCTS }${ EMAIL_SIGNATURE }`,
                attachments
            };

            await sendEmailAdapter(emailOptions);
        } catch (error) {
            throw error;
        }
    }

}