const EMAIL_ADS_SUBJECT_PRODUCTS = '¡Nuevos productos de Tech Store!';
const EMAIL_ADS_HTML_PRODUCTS = '<p>¡Hola!<br><br>Te adjuntamos la lista de los nuevos productos que tenemos disponibles.<br><br></p>'
const EMAIL_SIGNATURE = '<p>Equipo Tech Store</p>';

const EMAIL_INVOICE_SUBJECT = 'Comprobante electrónico';
const EMAIL_INVOICE_HTML = '<p>¡Hola!<br><br>Te adjuntamos el comprobante electrónico generado en tu compra.<br><br></p>';

const PRODUCTS_LIST_FILE_HEADER = (createdAt: string) => `********************** TECH STORE **********************\n\nFECHA: ${ createdAt }\n_________________________________________________________\nPRODUCTO\t\t\t\t\tPRECIO\n_________________________________________________________\n`;

const COMPANY_NAME = 'TECH STORE';
const COMPANY_ADDRESS = 'Milagro, Guayas';
const COMPANY_WEBSITE = 'api-rest-tech-store.onrender.com';

const LABEL_INVOCE_NUMBER = 'INVOICE #';
const LABEL_INVOICE_DATE = 'DATE';
const LABEL_INVOICE_CUSTOMER = 'CUSTOMER';

const LABEL_INVOICE_QUANTITY = 'QUANTITY';
const LABEL_INVOICE_DESCRIPTION = 'DESCRIPTION';
const LABEL_INVOICE_UNIT_PRICE = 'UNIT PRICE';
const LABEL_INVOICE_AMOUNT = 'AMOUNT';
const LABEL_INVOICE_TOTAL = 'TOTAL';

export {
    EMAIL_ADS_SUBJECT_PRODUCTS,
    EMAIL_ADS_HTML_PRODUCTS,
    EMAIL_SIGNATURE,
    EMAIL_INVOICE_SUBJECT,
    EMAIL_INVOICE_HTML,
    PRODUCTS_LIST_FILE_HEADER,
    COMPANY_NAME,
    COMPANY_ADDRESS,
    COMPANY_WEBSITE,
    LABEL_INVOCE_NUMBER,
    LABEL_INVOICE_DATE,
    LABEL_INVOICE_CUSTOMER,
    LABEL_INVOICE_QUANTITY,
    LABEL_INVOICE_DESCRIPTION,
    LABEL_INVOICE_UNIT_PRICE,
    LABEL_INVOICE_AMOUNT,
    LABEL_INVOICE_TOTAL,
};