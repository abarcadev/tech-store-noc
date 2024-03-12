import { CronJob } from "cron";
import { ProductAdsController } from "../controller/product-ads.controller";
import { env } from "../config/environment";

export const emailAdsJobAdapter = () => {
    try {
        const cronTime   = env.CRON_EVERY_TIME;
        const controller = new ProductAdsController();

        CronJob.from({
            cronTime,
            onTick: async () => {
                await controller.createAdvertising();   
            },
            start: true
        });
    } catch (error) {
        throw error;
    }
};