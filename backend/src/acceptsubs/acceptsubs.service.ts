/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2';
import config from 'src/dbpar';
import { AppService } from 'src/app.service';
import { Service } from './service';


@Injectable()
export class AcceptSubsService {
    constructor(private readonly appService: AppService, private readonly Service: Service) {}

    async acceptSubscribes(tok: object | any, res: any){
        //  Перевірити
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id)
            let admin = await this.appService.citizen(a.user_id, tok.flat_id)
            if(fl || (admin.acces_discuss === 1 && admin.acces_added === 1)){
                if(await this.appService.citizen(tok.user_id, tok.flat_id) === false){
                    let par = await this.appService.getUserParams(tok.user_id)
                    if(par.add_in_flat == 1){
                        const conee = mysql.createConnection(config)
                        conee.query('INSERT INTO citizen (user_id, flat_id) VALUES (?, ?)', [tok.user_id, tok.flat_id],(err, resul)=>{console.log(err)})
                        conee.query('DELETE FROM accept_subs WHERE flat_id = ? AND user_id = ?;', [tok.flat_id, tok.user_id],(err, resul)=>{1})
                        conee.end()
                        res.status(200).json({ status: true });
                    }else{
                        res.status(200).json({ status: "Користувач заборонив себе додавати" });
                    }
                }else{
                    res.status(200).json({ status: "Вже доданий" });
                }
            }else{
                res.status(200).json({ status: "Немає доступу" });
            }
        }else{
            res.status(200).json({ status: "Авторизуйтесь" });
        }
    }


    async deleteSubs(tok: any, res: any): Promise<any> {
        //  Перевірити
        let a = await this.appService.authentification(tok.auth)
        let accept_subs = await this.appService.accept_subs(tok.user_id, tok.flat_id)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id)
            if(fl || (await this.appService.citizen(a.user_id, tok.flat_id)).acces_discuss === 1){
                if(await this.appService.accept_subs(tok.user_id, tok.flat_id)){
                    const conee = mysql.createConnection(config)
                    conee.query('DELETE FROM accept_subs WHERE flat_id = ? AND user_id = ?;', [tok.flat_id, accept_subs.user_id])
                    conee.end()
                    res.status(200).json({ status: true });
                }else{
                    res.status(200).json({ status: "Дискусії немає" });
                }
            }else{
                res.status(200).json({ status: "Немає доступу" });
            }
        }else{
            res.status(200).json({ status:  "Авторизуйтесь" });
        }
    }

    async deleteYSubs(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            const conee = mysql.createConnection(config)
            conee.query('DELETE FROM accept_subs WHERE flat_id = ? AND user_id = ?;', [tok.flat_id, a.user_id])
            conee.end()
            res.status(200).json({ status: true });
        }else{
            res.status(200).json({ status:  "Авторизуйтесь" });
        }
    }


    async getAccepSubs(tok: any, res: any): Promise<any> {
        //  Перевірити
        
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id)
            if(fl || (await this.appService.citizen(a.user_id, tok.flat_id)).acces_discuss === 1){
                let subsID:Array<any> | any = await this.Service.getIDAccSubs(tok.flat_id, tok.offs)
                let subs = await Promise.all(subsID.map(async (e : any) => {
                    return await this.Service.getAccSubs(e.user_id)      
                }));
                res.status(200).json( subs );
            }else{
                res.status(200).json({ status: "Немає доступу" });
            }
        }else{
            res.status(200).json({ status:  "Авторизуйтесь" });
        }
    }

    async getAccepYSubs(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){   
            let flIDSubs:Array<any> | any = await this.Service.getIDAccFlats(a.user_id, tok.offs)
            let flatSu = await Promise.all(flIDSubs.map(async (e : any) => {
                return await this.appService.getFlatforAccSubs(e.flat_id)      
            }));
            res.status(200).json( flatSu );
        }else{
            res.status(200).json({ status:  "Авторизуйтесь" });
        }
    }


    async getCountSubs(tok: any, res: any): Promise<any> {
        //  Перевірити
        let a = await this.appService.authentification(tok.auth)
        if(a){
            if(await this.appService.flatCheck(a.user_id, tok.flat_id)){
                res.status(200).json({ status: await this.Service.countYdisc(tok.flat_id) });
            }else{
                let admin = await this.appService.citizen(a.user_id, tok.flat_id)
                if(admin.acces_discuss === 1){
                    res.status(200).json({ status: await this.Service.countYdisc(tok.flat_id) })
                }else{
                    res.status(200).json({ status: "Немає доступу" });
                }
            }
        }else{
            res.status(200).json({ status:  "Авторизуйтесь" });
        }    
    }

    async getCountYsubs(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            res.status(200).json({ status: await this.Service.countDisc(a.user_id) });
        }else{
            res.status(200).json({ status:  "Авторизуйтесь" });
        }
    }



}
