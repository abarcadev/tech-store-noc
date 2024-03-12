import { CronJob } from "cron";
import { env } from "../config/environment";
import { InvoiceController } from "../controller/invoice.controller";

export  const emailInvoiceJobAdapter = () => {
    try {
        const cronTime   = env.CRON_EVERY_MIDNIGHT;
        const controller = new InvoiceController();
        
        CronJob.from({
            cronTime,
            onTick: async () => {
                await controller.createInvoice();
            },
            start: true
        });
    } catch (error) {
        throw error;
    }
}