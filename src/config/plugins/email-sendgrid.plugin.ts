import sgMail from "@sendgrid/mail";
import { env } from "../environment";
import { SendEmailOptionsI } from "../../interfaces/send-email.interface";

export const sendEmailAdapter = async (options: SendEmailOptionsI) => {
    try {
        sgMail.setApiKey(env.SENDGRID_API_KEY);

        const {
            to,
            subject,
            html,
            attachments = []
        } = options;

        const msg = {
            to,
            from: env.SENDGRID_EMAIL_SENDER,
            subject,
            html,
            attachments
        };

        await sgMail.sendMultiple(msg);
    } catch (error) {
        throw error;
    }
};