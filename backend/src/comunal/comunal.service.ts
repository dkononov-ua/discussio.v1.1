/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2';
import config from 'src/dbpar';
import { AppService } from 'src/app.service';
import { Service } from './service';


@Injectable()
export class ComunalService {
    constructor(private readonly appService: AppService, private readonly Service: Service) {}

    async addComunal(tok: any, res: any): Promise<any> {
        //  Перевірити
        try{
            let a = await this.appService.authentification(tok.auth)
            if(a){
                let fl = await this.appService.flatCheck(a.user_id, tok.flat_id)
                if(fl){
                    await this.Service.addComunal(tok, a.user_id)
                    res.status(200).json({ status: "Данні по комуналці успішно змінені" });
                }else{
                    let admin = await this.appService.citizen(a.user_id, tok.flat_id)
                    if(admin.acces_comunal === 1){
                        await this.Service.addComunal(tok, a.user_id)
                        res.status(200).json({ status: "Данні по комуналці успішно змінені" });
                    }else if(admin.acces_comunal_indexes === 1){
                        let a = {flat_id: tok.flat_id, comunal_name: tok.comunal_name, when_pay_m: tok.when_pay_m, when_pay_y: tok.when_pay_y, comunal:{comunal_before: tok.comunal.comunal_before, comunal_now: tok.comunal.comunal_now, option_sendData:tok.comunal.option_sendData}}
                        await this.Service.addComunalBefNow(a)
                        res.status(200).json({ status:"Показники дадані" });
                    }
                }
            }else{
                res.status(200).json({ status:false });
            }
        }catch(err){
            console.log(err)
            res.status(200).json({ status: false });}
        
    }

    async addComunalCompany(tok: any, res: any): Promise<any> {
        //  Перевірити
        try{
            let a = await this.appService.authentification(tok.auth)
            if(a){
                let fl = await this.appService.flatCheck(a.user_id, tok.flat_id)
                if(fl){
                    await this.Service.addComunalCompany(tok)
                    res.status(200).json({ status: "Данні по комуналці успішно змінені" });
                }else{
                    let admin = await this.appService.citizen(a.user_id, tok.flat_id)
                    if(admin.acces_comunal === 1){
                        await this.Service.addComunalCompany(tok)
                        res.status(200).json({ status: "Данні по комуналці успішно змінені" });
                    }else{
                        res.status(200).json({ status: false });
                    }
                }
            }else{
                res.status(200).json({ status: false });
            }
        }catch(err){
            console.log(err)
            res.status(200).json({ status: false });
        }
        
    }

    async addComunalbutton(tok: any, res: any): Promise<any> {
        //  Перевірити
        try{
            let a = await this.appService.authentification(tok.auth)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id)
            if(fl){
                res.status(200).json(await this.Service.addComunalName(fl.flat_id,tok.comunal));
            }else{
                let admin = await this.appService.citizen(a.user_id, tok.flat_id)
                if(admin.acces_comunal === 1){
                    res.status(200).json(await this.Service.addComunalName(admin.flat_id,tok.comunal));
                }else{
                    res.status(200).json({ status: false });
                }
            }
        }else{
            res.status(200).json({ status: false });
        }
        }catch(err){
            console.log(err)
            res.status(200).json({ status: false });
        }
        
    }

    async changeComunal(tok: any, res: any): Promise<any> {
        //  Перевірити
        try{
            let a = await this.appService.authentification(tok.auth)
            if(a){
                let fl = await this.appService.flatCheck(a.user_id, tok.flat_id)
                if(fl){
                    await this.Service.addComunal(tok, a.user_id)
                    res.status(200).json({ status: "Данні по комуналці успішно змінені" });
                }else{
                    let admin = await this.appService.citizen(a.user_id, tok.flat_id)
                    if(admin.acces_comunal === 1){
                        await this.Service.addComunal(tok, a.user_id)
                        res.status(200).json({ status: "Данні по комуналці успішно змінені" });
                    }else{
                        res.status(200).json({ status: false });
                    }
                }
            }else{
                res.status(200).json({ status: false });
            }
        }catch(err){
            console.log(err)
            res.status(200).json({ status: false });
        }
    }

    async getComunal(tok: any, res: any): Promise<any> {
        //  Перевірити
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id)
            if(fl){
                res.status(200).json({ comunal: await this.Service.getComunalYear(fl.flat_id, tok.comunal_name, tok.when_pay_y) });
            }else{
                let admin = await this.appService.citizen(a.user_id, tok.flat_id)
                if(admin.acces_comunal === 1){
                    res.status(200).json({ comunal: await this.Service.getComunalYear(tok.flat_id, tok.comunal_name, tok.when_pay_y) });
                }else{
                    let accept_subs = await this.appService.accept_subs(a.user_id, tok.flat_id)
                    if(accept_subs){
                        res.status(200).json({ comunal: await this.Service.getComunalYear(tok.flat_id, tok.comunal_name, tok.when_pay_y) });
                    }else{
                        res.status(200).json({ status: false });
                    }   
                }
            }
        }else{
            res.status(200).json({ status: false });
        }
    }


    async getComunalAll(tok: any, res: any): Promise<any> {
        //  Перевірити
        let a = await this.appService.authentification(tok.auth)

        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id) 
            if(fl){
                let flat_name = await this.appService.getFlatName(fl.flat_id)
                res.status(200).json({ comunal: await this.Service.getComunalAll(fl.flat_id, tok.when_pay_m, tok.when_pay_y), flat_name: flat_name });
            }else{
                let admin = await this.appService.citizen(a.user_id, tok.flat_id)
                if(admin.acces_comunal === 1){
                    let flat_name = await this.appService.getFlatName(tok.flat_id)
                    res.status(200).json({ comunal: await this.Service.getComunalAll(tok.flat_id, tok.when_pay_m, tok.when_pay_y), flat_name: flat_name});
                }else{
                    let accept_subs = await this.appService.accept_subs(a.user_id, tok.flat_id)
                    if(accept_subs){
                        let flat_name = await this.appService.getFlatName(tok.flat_id)
                        res.status(200).json({ comunal: await this.Service.getComunalAll(tok.flat_id, tok.when_pay_m, tok.when_pay_y), flat_name: flat_name});
                    }else{
                        res.status(200).json({ status: false });
                    }   
                }
            }
        }else{
            res.status(200).json({ status: false });
        }

    }


    async getComunalYearAll(tok: any, res: any): Promise<any> {
        //  Перевірити
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id) 
            if(fl){
                let flat_name = await this.appService.getFlatName(fl.flat_id)
                res.status(200).json({ comunal: await this.Service.getComunalYearAll(fl.flat_id, tok.when_pay_y), flat_name: flat_name });
            }else{
                let admin = await this.appService.citizen(a.user_id, tok.flat_id)
                if(admin.acces_comunal === 1){
                    let flat_name = await this.appService.getFlatName(tok.flat_id)
                    res.status(200).json({ comunal: await this.Service.getComunalYearAll(tok.flat_id, tok.when_pay_y), flat_name: flat_name });
                }else{
                    let accept_subs = await this.appService.accept_subs(a.user_id, tok.flat_id)
                    if(accept_subs){
                        let flat_name = await this.appService.getFlatName(tok.flat_id)
                        res.status(200).json({ comunal: await this.Service.getComunalYearAll(tok.flat_id, tok.when_pay_y), flat_name: flat_name });
                    }else{
                        res.status(200).json({ status: false });
                    }   
                }
            }
        }else{
            res.status(200).json({ status: false });
        }

    }

    async getComunalbutton(tok: any, res: any): Promise<any> {
        //  Перевірити
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id) 
            if(fl){
                res.status(200).json({ comunal: await this.Service.getComunalName(fl.flat_id) });
            }else{
                let admin = await this.appService.citizen(a.user_id, tok.flat_id)
                if(admin.acces_comunal === 1){
                    res.status(200).json({ comunal: await this.Service.getComunalName(tok.flat_id) });
                }else{
                    let accept_subs = await this.appService.accept_subs(a.user_id, tok.flat_id)
                    if(accept_subs){
                        res.status(200).json({ comunal: await this.Service.getComunalName(tok.flat_id) });
                    }else{
                        res.status(200).json({ status: false });
                    }   
                }
            }
        }else{
            res.status(200).json({ status: false });
        }
    }


    async deleteComunalbutton(tok: any, res: any): Promise<any> {
        //  Перевірити
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id)
            if(fl){
                res.status(200).json( {status:await this.Service.deleteComunal(fl.flat_id, tok.comunal_name)})
            }else{
                let admin = await this.appService.citizen(a.user_id, tok.flat_id)
                if(admin.acces_comunal === 1){
                    res.status(200).json( {status:await this.Service.deleteComunal(admin.flat_id, tok.comunal_name)})
                }else{
                    res.status(200).json({ status: false });
                }
            }
        }else{
            res.status(200).json({ status: false });
        }
    }


    async deleteComunal(tok: any, res: any): Promise<any> {
        //  Перевірити
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id)
            if(fl){
                res.status(200).json({ status: await this.Service.deleteComunalOne(fl.flat_id, tok) });
            }else{
                let admin = await this.appService.citizen(a.user_id, tok.flat_id)
                if(admin.acces_comunal === 1){
                    res.status(200).json({ status: await this.Service.deleteComunalOne(admin.flat_id, tok) });
                }else{
                    res.status(200).json({ status: false });
                }
            }
        }else{
            res.status(200).json({ status: false });
        }
    }


}
