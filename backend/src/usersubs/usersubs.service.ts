/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
// import conee from 'src/db';
import * as mysql from 'mysql2'
import config from 'src/dbpar';
import { AppService } from 'src/app.service';
import { Service } from './service';


@Injectable()
export class UsersubsService {
    constructor(private readonly appService: AppService, private readonly Service: Service) { }

    async subscribe(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id)
            if(fl){
                let feature_user = await this.Service.feature_user(tok.user_id)
                if(feature_user){
                    let ac_subs = await this.appService.accept_subs(tok.user_id, tok.flat_id)
                    if(ac_subs === false){
                        let subs = await this.Service.user_subscribes(tok.user_id, tok.flat_id)
                        if(subs === false){
                            const conee = mysql.createConnection(config)
                            try{
                                conee.query('INSERT INTO user_subscribes (user_id, flat_id) VALUES (?, ?)', [tok.user_id, tok.flat_id])
                                res.status(200).json({ status: "Ви успішно підписались" });    
                            }catch(err){
                                console.log(err)
                                res.status(200).json({ status: false });
                            }finally{conee.end()}
                        }else{
                            const conee = mysql.createConnection(config)
                            try{
                                conee.query('DELETE FROM user_subscribes WHERE flat_id = ? AND user_id = ?;', [tok.flat_id, tok.user_id])
                                res.status(200).json({ status: "Ви успішно відписались" });
                            }catch(err){
                                console.log(err)
                                res.status(200).json({ status: false });
                            }finally{conee.end()}
                        }
                    }else{
                        res.status(200).json({ status: "Ви в дискусії" });
                    }
                }else{
                    res.status(200).json({ status: false });
                }
            }else{
                let admin = await this.appService.citizen(a.user_id, tok.flat_id)
                if(admin.acces_subs === 1){
                    let feature_user = await this.Service.feature_user(tok.user_id)
                    if(feature_user){
                        let ac_subs = await this.appService.accept_subs(tok.user_id, tok.flat_id)
                        if(ac_subs === false){
                            let subs = await this.Service.user_subscribes(tok.user_id, tok.flat_id)
                            if(subs === false){
                                const conee = mysql.createConnection(config)
                                try{
                                    conee.query('INSERT INTO user_subscribes (user_id, flat_id) VALUES (?, ?)', [tok.user_id, tok.flat_id])
                                    res.status(200).json({ status: "Ви успішно підписались" });
                                }catch(err){
                                    console.log(err)
                                    res.status(200).json({ status: false });
                                }finally{conee.end()}
                            }else{
                                const conee = mysql.createConnection(config)
                                try{
                                    conee.query('DELETE FROM user_subscribes WHERE flat_id = ? AND user_id = ?;', [tok.flat_id, tok.user_id])
                                    res.status(200).json({ status: "Ви успішно відписались" });
                                }catch(err){
                                    console.log(err)
                                    res.status(200).json({ status: false });
                                }finally{conee.end()}
                            }
                        }else{
                            res.status(200).json({ status: "Ви в дискусії" });
                        }
                }else{
                    res.status(200).json({ status: false });
                }
                }else{
                    res.status(200).json({ status: false });    
                }
            }
        }else{
            res.status(200).json({ status: false });
        }
    }


    async checkSubscribe(tok: any, res: any): Promise<any> {
        try {
            let a = await this.appService.authentification(tok.auth)
            if(a){
                let fl = await this.appService.flatCheck(a.user_id, tok.flat_id)
                if(fl){
                    let feature_user = await this.Service.feature_user(tok.user_id)
                    if(feature_user){
                        let ac_subs = await this.appService.accept_subs(tok.user_id, tok.flat_id)
                        if(ac_subs === false){
                            let subs = await this.Service.user_subscribes(tok.user_id, tok.flat_id)
                            if(subs === false){
                                res.status(200).json({ status: "Ви успішно відписались" });
                            }else{
                                res.status(200).json({ status: "Ви успішно підписались" });
                            }
                        }else{
                            res.status(200).json({ status: "Ви в дискусії" });
                        }
                    }else{
                        res.status(200).json({ status: false });
                    }
                }else{
                    let admin = await this.appService.citizen(a.user_id, tok.flat_id)
                    if(admin.acces_subs === 1){
                        let feature_user = await this.Service.feature_user(tok.user_id)
                        if(feature_user){
                            let ac_subs = await this.appService.accept_subs(tok.user_id, tok.flat_id)
                            if(ac_subs === false){
                                let subs = await this.Service.user_subscribes(tok.user_id, tok.flat_id)
                                if(subs === false){
                                    res.status(200).json({ status: "Ви успішно підписались" });
                                }else{
                                    res.status(200).json({ status: "Ви успішно відписались" });
                                }
                            }else{
                                res.status(200).json({ status: "Ви в дискусії" });
                            }
                    }else{
                        res.status(200).json({ status: false });
                    }
                    }else{
                        res.status(200).json({ status: false });    
                    }
                }
            }else{
                res.status(200).json({ status: false });
            }
        } catch(err) {
            console.log(err)
            res.status(200).json({ status: "Ви не авторизовані" });
        }

    }

    async acceptSubscribes(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let subs = await this.Service.user_subscribes(a.user_id, tok.flat_id)
            if(subs){
                let acc_subs = await this.appService.accept_subs(a.user_id, tok.flat_id)
                if(acc_subs === false){
                    const conee = mysql.createConnection(config)
                    try{
                        conee.query('INSERT INTO accept_subs (user_id, flat_id) VALUES (?, ?)', [subs.user_id, subs.flat_id])
                        conee.query('DELETE FROM user_subscribes WHERE flat_id = ? AND user_id = ?;', [subs.flat_id, subs.user_id])
                        res.status(200).json({ status: true });
                    }catch(err){
                        console.log(err)
                        res.status(200).json({ status: false });
                    }finally{conee.end()}

                }else{
                    res.status(200).json({ status: "Ви вже в дискусії" });
                }
            }else{
                res.status(200).json({ status: false });
            }
        }else{
            res.status(200).json({ status: false });
        }

    }


    async deleteSubs(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id)
            if(fl){
                const conee = mysql.createConnection(config)
                try{
                    conee.query('DELETE FROM user_subscribes WHERE flat_id = ? AND user_id = ?;', [fl.flat_id, tok.user_id])
                    res.status(200).json({ status: true });
                }catch(err){
                    console.log(err)
                    res.status(200).json({ status: false });
                }finally{conee.end()}
            }else{
                let admin = await this.appService.citizen(a.user_id, tok.flat_id)
                if(admin.acces_subs === 1){
                    const conee = mysql.createConnection(config)
                    try{
                        conee.query('DELETE FROM user_subscribes WHERE flat_id = ? AND user_id = ?;', [admin.flat_id, tok.user_id])
                        res.status(200).json({ status: true });
                    }catch(err){
                        console.log(err)
                        res.status(200).json({ status: false });
                    }finally{conee.end()}
                }else{
                    res.status(200).json({ status: false });
                }   
            }
        }else{
            res.status(200).json({ status: false });
        }
    }

    async deleteYSubs(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if (a) {
            const conee = mysql.createConnection(config)
            try{
                conee.query('DELETE FROM user_subscribes WHERE flat_id = ? AND user_id = ?;', [tok.flat_id, a.user_id])
                res.status(200).json({ status: true });
            }catch(err){
                console.log(err)
                res.status(200).json({ status: false });
            }finally{conee.end()}
        } else {
            res.status(200).json({ status: false });
        }
    }


    async getYSubs(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id)
            if(fl){
                let subsID: Array<any> | any = await this.Service.getIDuserSubs(fl.flat_id, tok.offs)
                let subs = await Promise.all(subsID.map(async (e: any) => {
                    return await this.Service.getUserSubs(e.user_id)
                }));
                res.status(200).json(subs);
            }else{
                let admin = await this.appService.citizen(a.user_id, tok.flat_id)
                if(admin.acces_subs === 1){
                    let subsID: Array<any> | any = await this.Service.getIDuserSubs(admin.flat_id, tok.offs)
                    let subs = await Promise.all(subsID.map(async (e: any) => {
                        return await this.Service.getUserSubs(e.user_id)
                    }));
                    res.status(200).json(subs);
                }else{
                    res.status(200).json({ status: false });
                }   
            }
        }else{
            res.status(200).json({ status: false });
        }

    }

    async getSubs(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        let flIDSubs: Array<any> | any = await this.Service.getUserIDFlats(a.user_id, tok.offs)
        if (a && flIDSubs) {
            let flatSu = await Promise.all(flIDSubs.map(async (e: any) => {
                return await this.appService.getFlatforUserSubs(e.flat_id)
            }));
            res.status(200).json(flatSu);
        } else {
            res.status(200).json({ status: false });
        }
    }


    async CountUserSubs(tok: any, res: any): Promise<any> {
        //  Перевірити
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id)
            if(fl){
                res.status(200).json({ status: await this.Service.countUserSubs(tok.flat_id) });
            }else{
                let admin = await this.appService.citizen(a.user_id, tok.flat_id)
                if(admin.acces_subs === 1){
                    res.status(200).json({ status: await this.Service.countUserSubs(tok.flat_id) });
                }else{
                    res.status(200).json({ status: false });
                }   
            }
        }else{
            res.status(200).json({ status: false });
        }
    }
    
      async CountYUserSubs(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            res.status(200).json({ status: await this.Service.countYUserSubs(a.user_id) });
        }else{
            res.status(200).json({ status: false });
        }
    }


}
