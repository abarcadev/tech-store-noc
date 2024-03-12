import "dotenv/config";
import { get } from "env-var";

export const env = {

    HOST: get('HOST').required().asString(),
    PORT: get('PORT').required().asPortNumber(),

    URL_API          : get('URL_API').required().asString(),
    APP_USER         : get('APP_USER').required().asString(),
    APP_USER_PASSWORD: get('APP_USER_PASSWORD').required().asString(),

    SENDGRID_API_KEY     : get('SENDGRID_API_KEY').required().asString(),
    SENDGRID_EMAIL_SENDER: get('SENDGRID_EMAIL_SENDER').required().asEmailString(),

    LOCAL_FILE_FOLDER: get('LOCAL_FILE_FOLDER').required().asString(),
    TECH_STORE_LOGO  : get('TECH_STORE_LOGO').required().asString(),

    CRON_EVERY_TIME    : get('CRON_EVERY_TIME').required().asString(),
    CRON_AT_TIME       : get('CRON_AT_TIME').required().asString(), 
    CRON_EVERY_DATETIME: get('CRON_EVERY_DATETIME').required().asString(), 
    CRON_EVERY_MIDNIGHT: get('CRON_EVERY_MIDNIGHT').required().asString(), 
    
    NODE_ENV: get('NODE_ENV').required().asString()  
    
};