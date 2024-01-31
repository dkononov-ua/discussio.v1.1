import { Injectable } from '@nestjs/common';
import { AppService } from "src/app.service";
import { Service } from "./service";

@Injectable()
export class AdminService {
    constructor(private readonly appService: AppService, private readonly Service: Service) {}

    async getUser(tok: any, res: any): Promise<any> {
        const a = await this.appService.authentification(tok.auth);
        if(a.owner === 1 || a.admin === 1) {
            res.status(200).json({ status: await this.Service.getUser(tok.user_id) });
        } else {
          res.status(200).json({ status: false });
        }
    }


    async getFlat(tok: any, res: any): Promise<any> {
        const a = await this.appService.authentification(tok.auth);
        if(a.owner === 1 || a.admin === 1) {
            res.status(200).json({ status: await this.Service.getFlat(tok.flat_id) });
        } else {
          res.status(200).json({ status: false });
        }
    }

    async getUsers(tok: any, res: any): Promise<any> {
        const a = await this.appService.authentification(tok.auth);
        if(a.owner === 1 || a.admin === 1) {
            res.status(200).json({ status: await this.Service.getUsers(tok) });
        } else {
          res.status(200).json({ status: false });
        }
    }

    async getFlats(tok: any, res: any): Promise<any> {
        const a = await this.appService.authentification(tok.auth);
        if(a.owner === 1 || a.admin === 1) {
            res.status(200).json({ status: await this.Service.getFlats(tok) });
        } else {
          res.status(200).json({ status: false });
        }
    }


    async getUsersReports(tok: any, res: any): Promise<any> {
        const a = await this.appService.authentification(tok.auth);
        if(a.owner === 1 || a.admin === 1) {
            res.status(200).json({ status: await this.Service.getUsersReports(tok) });
        } else {
          res.status(200).json({ status: false });
        }
    }

    async getFlatsReports(tok: any, res: any): Promise<any> {
        const a = await this.appService.authentification(tok.auth);
        if(a.owner === 1 || a.admin === 1) {
            res.status(200).json({ status: await this.Service.getFlatsReports(tok) });
        } else {
          res.status(200).json({ status: false });
        }
    }



    async changeUser(tok: any, res: any): Promise<any> {
        const a = await this.appService.authentification(tok.auth);
        if(a.owner === 1 || a.admin === 1) {
            res.status(200).json({ status: await this.Service.changeUser(tok) });
        } else {
          res.status(200).json({ status: false });
        }
    }

    async changeFlat(tok: any, res: any): Promise<any> {
        const a = await this.appService.authentification(tok.auth);
        if(a.owner === 1 || a.admin === 1) {
            res.status(200).json({ status: await this.Service.changeFlat(tok) });
        } else {
          res.status(200).json({ status: false });
        }
    }


    async deleteUserReport(tok: any, res: any): Promise<any> {
        const a = await this.appService.authentification(tok.auth);
        if(a.owner === 1 || a.admin === 1) {
            res.status(200).json({ status: await this.Service.deleteUserReport(tok) });
        } else {
          res.status(200).json({ status: false });
        }
    }

    async deleteFlatReport(tok: any, res: any): Promise<any> {
        const a = await this.appService.authentification(tok.auth);
        if(a.owner === 1 || a.admin === 1) {
            res.status(200).json({ status: await this.Service.deleteFlatReport(tok) });
        } else {
          res.status(200).json({ status: false });
        }
    }


}
