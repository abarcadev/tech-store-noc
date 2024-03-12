import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from 'exceljs';
import { 
    COMPANY_ADDRESS, 
    COMPANY_NAME, 
    COMPANY_WEBSITE, 
    EMAIL_INVOICE_HTML, 
    EMAIL_INVOICE_SUBJECT, 
    EMAIL_SIGNATURE, 
    LABEL_INVOCE_NUMBER, 
    LABEL_INVOICE_AMOUNT, 
    LABEL_INVOICE_CUSTOMER, 
    LABEL_INVOICE_DATE, 
    LABEL_INVOICE_DESCRIPTION, 
    LABEL_INVOICE_QUANTITY,
    LABEL_INVOICE_TOTAL,
    LABEL_INVOICE_UNIT_PRICE
} from "../utils/messages";
import { 
    APIPayloadParams,
    APIPayloadSave, 
    LoginBodyI, 
    ParamsGetAllOrdersI, 
    ResponseGetAllOrdersI, 
    ResponseGetByIdOrderI, 
    ResponseLoginI 
} from "../interfaces/tech-store";
import { env } from "../config/environment";
import { LOGIN, ORDERS } from "../config/endpoints-tech-store";
import { ApiService } from "../services/tech-store/api.service";
import { getCurrentDate } from "../utils/functions";
import { 
    createFolderAdapter, 
    readFileB64Adapter, 
    sendEmailAdapter 
} from "../config/plugins";
import { AttachmentsI, SendEmailOptionsI } from "../interfaces/send-email.interface";
import { MIMETypesEnum } from "../enums/mime-type.enum";

export class InvoiceController {

    private readonly invoicePath = `uploads/invoices/${ getCurrentDate() }`;

    constructor() {}

    async createInvoice() {
        try {
            const token  = await this.getLogin();
            const orders = await this.getAllOrders(token);

            if (orders.length > 0) {
                for (const order of orders) {
                    const data = await this.getOrderById(token, order.id);
                    
                    await this.createPDF(data);
                    await this.createXLS(data);
                    await this.sendEmail(data.email, data.id);
                    console.log(`Invoices sent for date: ${ getCurrentDate() }`);
                }
            }
        } catch (error) {
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

    private async getAllOrders(token: string) {
        try {
            const query: ParamsGetAllOrdersI = {
                orderDate: getCurrentDate(),
                customer : '',
                limit    : 100,
                skip     : 0
            };

            const payload: APIPayloadParams<ParamsGetAllOrdersI> = {
                url: `${ env.URL_API }/${ ORDERS }`,
                token,
                query
            };

            const { data } = await ApiService.getAll<ParamsGetAllOrdersI, ResponseGetAllOrdersI>(payload);

            return data;
        } catch (error) {
            throw error;
        }
    }

    private async getOrderById(token: string, id: string) {
        try {
            const payload: APIPayloadParams<null> = {
                url: `${ env.URL_API }/${ ORDERS }`,
                token,
                id
            };

            const data = await ApiService.getById<null, ResponseGetByIdOrderI>(payload);

            return data;
        } catch (error) {
            throw error;
        }
    }

    private async createPDF(order: ResponseGetByIdOrderI) {
        try {
            createFolderAdapter(this.invoicePath);

            const doc = new jsPDF();

            doc.setFontSize(20);
            doc.setFont('helvetica', 'bold');
            doc.text(COMPANY_NAME, 10, 15);

            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text(COMPANY_ADDRESS, 10, 22);

            doc.setFont('helvetica', 'bold');
            doc.text('Website:', 10, 29);
            doc.setFont('helvetica', 'normal');
            doc.text(COMPANY_WEBSITE, 29, 29);

            doc.setFont('helvetica', 'bold');
            doc.text(LABEL_INVOCE_NUMBER, 10, 42);
            doc.setFont('helvetica', 'normal');
            doc.text(`${ order.id }`, 38, 42);

            doc.setFont('helvetica', 'bold');
            doc.text(LABEL_INVOICE_DATE, 10, 49);
            doc.setFont('helvetica', 'normal');
            doc.text(`${ order.orderDate }`, 38, 49);

            doc.setFont('helvetica', 'bold');
            doc.text(LABEL_INVOICE_CUSTOMER, 10, 56);
            doc.setFont('helvetica', 'normal');
            doc.text(`${ order.customerName }`, 38, 56);

            const headers: any[] = [
                { dataKey: 'quantity', header: LABEL_INVOICE_QUANTITY },
                { dataKey: 'description', header: LABEL_INVOICE_DESCRIPTION },
                { dataKey: 'unitPrice', header: LABEL_INVOICE_UNIT_PRICE },
                { dataKey: 'amount', header: LABEL_INVOICE_AMOUNT }
            ];

            const orderDet: any[] = [];
            
            for (const data of order.orderDetails) {
                orderDet.push({
                    quantity   : data.quantity,
                    description: data.productName,
                    unitPrice  : data.price.toFixed(2),
                    amount     : data.total.toFixed(2)
                });
            }
            
            autoTable(doc, {
                startY: 69,
                columns: headers,
                body: orderDet,
                foot: [
                    ['', '', LABEL_INVOICE_TOTAL, `$ ${ order.total.toFixed(2) }` ]
                ],
                showFoot: 'lastPage',
                headStyles: {
                    font     : 'helvetica',
                    fontSize : 12,
                    halign   : 'center',
                    fillColor: [217, 217, 214],
                    textColor: [0, 0, 0]              
                },
                bodyStyles: {
                    font    : 'helvetica',
                    fontSize: 12
                },
                columnStyles: {
                    quantity   : { halign: 'center' },
                    description: { halign: 'left' },
                    unitPrice  : { halign: 'right' },
                    amount     : { halign: 'right' }
                },
                footStyles: {
                    font     : 'helvetica',
                    fontSize : 12,
                    halign   : 'right',
                    fillColor: [217, 217, 214],
                    textColor: [0, 0, 0]
                },
            });

            doc.save(`${ this.invoicePath }/${ order.id }.pdf`);
        } catch (error) {
            throw error;
        }
    }

    private async createXLS(order: ResponseGetByIdOrderI) {
        try {
            const workbook  = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('invoice');

            const style1 = {
                name: 'Helvetica',
                size: 20,
                bold: true
            };

            const style2 = {
                name: 'Helvetica',
                size: 12
            };

            const style3 = {
                name: 'Helvetica',
                size: 12,
                bold: true
            };

            worksheet.addRow([COMPANY_NAME]);
            worksheet.getCell('A1').font = style1;
            worksheet.getCell('A1').alignment = { vertical: 'middle' };

            const rowA = worksheet.getRow(1);
            rowA.height = 30;

            const columnA = worksheet.getColumn(1);
            columnA.width = 15;

            worksheet.addRow([COMPANY_ADDRESS]);
            worksheet.getCell('A2').font = style2;

            worksheet.addRow([`Website: ${ COMPANY_WEBSITE }`]);
            worksheet.getCell('A3').font = style2;
            
            worksheet.addRow([]);
            worksheet.addRow([LABEL_INVOCE_NUMBER, `${ order.id }`]);
            worksheet.getCell('A5').font = style3;
            worksheet.getCell('B5').font = style2;

            worksheet.addRow([LABEL_INVOICE_DATE, `${ order.orderDate }`]);
            worksheet.getCell('A6').font = style3;
            worksheet.getCell('B6').font = style2;

            worksheet.addRow([LABEL_INVOICE_CUSTOMER, `${ order.customerName }`]);
            worksheet.getCell('A7').font = style3;
            worksheet.getCell('B7').font = style2;

            worksheet.addRow([]);
            worksheet.addRow([]);
            worksheet.addRow([
                LABEL_INVOICE_QUANTITY, LABEL_INVOICE_DESCRIPTION, LABEL_INVOICE_UNIT_PRICE, LABEL_INVOICE_AMOUNT
            ]).font = style3;
            
            worksheet.getRow(10).alignment = { horizontal: 'center' };
            
            const columnB = worksheet.getColumn(2);
            columnB.width = 45;
            const columnC = worksheet.getColumn(3);
            columnC.width = 15;
            const columnD = worksheet.getColumn(4);
            columnD.width = 15;

            worksheet.getCell('A10').border = {
                top   : { style: 'thin' },
                left  : { style: 'thin' },
                bottom: { style: 'thin' },
                right : { style: 'thin' }
            };
            worksheet.getCell('B10').border = {
                top   : { style: 'thin' },
                left  : { style: 'thin' },
                bottom: { style: 'thin' },
                right : { style: 'thin' }
            };
            worksheet.getCell('C10').border = {
                top   : { style: 'thin' },
                left  : { style: 'thin' },
                bottom: { style: 'thin' },
                right : { style: 'thin' }
            };
            worksheet.getCell('D10').border = {
                top   : { style: 'thin' },
                left  : { style: 'thin' },
                bottom: { style: 'thin' },
                right : { style: 'thin' }
            };

            let i = 11;

            for (const orderDet of order.orderDetails) {
                worksheet.addRow([
                    orderDet.quantity, orderDet.productName, orderDet.price.toFixed(2), orderDet.total.toFixed(2)
                ]);
                worksheet.getRow(i).font = style2;
                worksheet.getCell(`A${i}`).alignment = { horizontal: 'center' };
                worksheet.getCell(`C${i}`).alignment = { horizontal: 'right' };
                worksheet.getCell(`D${i}`).alignment = { horizontal: 'right' };
                i++;
            }

            worksheet.addRow(['', '', LABEL_INVOICE_TOTAL, `$ ${ order.total.toFixed(2) }`]);
            worksheet.getRow(i).font = style3;
            worksheet.getRow(i).alignment = { horizontal: 'right' };

            await workbook.xlsx.writeFile(`${ this.invoicePath }/${ order.id }.xlsx`);
        } catch (error) {
            throw error;
        }
    }

    private async sendEmail(customerEmail: string, orderId: string) {
        try {
            const pdfInvoice: AttachmentsI = {
                content    : readFileB64Adapter(`${ this.invoicePath }/${ orderId }.pdf`),
                filename   : `${ orderId }.pdf`,
                type       : MIMETypesEnum.pdf,
                disposition: 'attachment'
            };

            const xlsInvoice: AttachmentsI = {
                content    : readFileB64Adapter(`${ this.invoicePath }/${ orderId }.xlsx`),
                filename   : `${ orderId }.xlsx`,
                type       : MIMETypesEnum.xlsx,
                disposition: 'attachment'
            };

            const attachments: AttachmentsI[] = [ pdfInvoice, xlsInvoice ];

            const emailOptions: SendEmailOptionsI = {
                to     : customerEmail,
                subject: EMAIL_INVOICE_SUBJECT,
                html   : `${ EMAIL_INVOICE_HTML }${ EMAIL_SIGNATURE }`,
                attachments
            };

            await sendEmailAdapter(emailOptions);      
        } catch (error) {
            throw error;
        }
    }

}