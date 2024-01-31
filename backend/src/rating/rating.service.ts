import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { Service } from './service';



@Injectable()
export class RatingService {
    constructor(private readonly appService: AppService, private readonly Service: Service) { }


    async addUserRating(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id);
            if(fl){
                res.status(200).json({ status: await this.Service.addUsersRating(tok) });
            }else{
                const admin = await this.appService.citizen(a.user_id, tok.flat_id);
                if(admin.acces_admin === 1){
                    res.status(200).json({ status: await this.Service.addUsersRating(tok) });
                }else{
                    res.status(200).json({ status: false });
                }
            }
        }else{
            res.status(200).json({ status: false });
        }
    }





    async getUserMarks(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            res.status(200).json({ status: await this.Service.getUserRating(tok.user_id) });
        }else{
            res.status(200).json({ status: 'Авторизуйтесь' });
        }
    }
    
    async addFlatRating(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            res.status(200).json({ status: await this.Service.addFlatsRating(tok, a.user_id) });
        }else{
            res.status(200).json({ status: 'Авторизуйтесь' });
        }
    }


    async getOwnerMarks(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            res.status(200).json({ status: await this.Service.getOwnerRating(tok.user_id) });
        }else{
            res.status(200).json({ status: 'Авторизуйтесь' });
        }
    }
}
