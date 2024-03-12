import { MIMETypesEnum } from "../enums/mime-type.enum";

interface SendEmailOptionsI {
    to          : string | string[];
    subject     : string;
    html        : string;
    attachments?: AttachmentsI[];
}

interface AttachmentsI {
    content    : string;
    filename   : string;
    type       : MIMETypesEnum;
    disposition: 'attachment'
}

export {
    SendEmailOptionsI,
    AttachmentsI,
};