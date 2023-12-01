import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { Service } from './service';

@Injectable()
export class ReportsService {
    constructor(private readonly appService: AppService, private readonly Service: Service) {}

    async ReportUser(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){ 
            res.status(200).json({ status: await this.Service.addUserReport(tok, a.user_id)})
        }else{
            res.status(200).json({ status: "Авторизуйтесь"})
        }
    }


    async ReportFlat(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){ 
            res.status(200).json({ status: await this.Service.addFlatReport(tok, a.user_id)})
        }else{
            res.status(200).json({ status: "Авторизуйтесь"})
        }
    }


}
