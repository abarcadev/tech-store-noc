import express from "express";
import { emailAdsJobAdapter, emailInvoiceJobAdapter,  } from "./presentation";

export default class Server {
    
    public readonly app = express();
    
    constructor() {
        this.middlewares();
    }

    private middlewares(): void {
        this.app.disable('x-powered-by');
    }
    
    async start(): Promise<void> {
        process.env.TZ = 'America/Guayaquil';
        
        console.log('Server started');
        
        emailInvoiceJobAdapter();
        emailAdsJobAdapter();
    }
    
}