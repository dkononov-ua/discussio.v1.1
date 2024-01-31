/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2';
import config from 'src/dbpar';
import { AppService } from 'src/app.service';
import { Service } from './service';

@Injectable()
export class AgreementService {
    constructor(private readonly appService: AppService, private readonly Service: Service) {}



    async addAgreement(tok: object | any, res: any){
        let a = await this.appService.authentification(tok.auth)
        
        if(a){
            if(await this.appService.flatCheck(a.user_id, tok.flat_id)){
                const agent_id = await this.appService.agent(tok.flat_id);
                if(agent_id){
                    if (await this.Service.addAgreement(tok, agent_id.user_id, tok.flat_id)){
                        res.status(200).json({ status: "Договір створено" });
                    }else{
                        res.status(200).json({ status: "Данні введено не правильно" });
                    }
                }else{
                    let owner = await this.appService.getFlatOwner(tok.flat_id);
                    if(await this.Service.addAgreement(tok, owner.owner_id, tok.flat_id)){
                        res.status(200).json({ status: "Договір створено" });
                    }else{
                        res.status(200).json({ status: "Данні введено не правильно" });
                    }
                }
            }else{
                let admin = await this.appService.citizen(a.user_id, tok.flat_id)
                if((admin.acces_agreement === 1 && admin.acces_added === 1 )){
                    const agent_id = await this.appService.agent(tok.flat_id);
                    if(agent_id){
                        if (await this.Service.addAgreement(tok, agent_id.user_id, tok.flat_id)){
                            res.status(200).json({ status: "Договір створено" });
                        }else{
                            res.status(200).json({ status: "Данні введено не правильно" });
                        }
                    }else{
                        let owner = await this.appService.getFlatOwner(tok.flat_id);
                        if(await this.Service.addAgreement(tok, owner.owner_id, tok.flat_id)){
                            res.status(200).json({ status: "Договір створено" });
                        }else{
                            res.status(200).json({ status: "Данні введено не правильно" });
                        }
                    }
                }else{
                    res.status(200).json({ status: "Немає доступу" });
                }
            }
        }else{
            res.status(200).json({ status: "Авторизуйтесь" });
        }

    }

    async acceptAgreement(tok: object | any, res: any){
        //  Перевірити
        let a = await this.appService.authentification(tok.auth)
        
        if(a){
            let agree = await this.Service.getAgreement(tok.agreement_id, tok.flat_id, a.user_id)
            if(agree){
                const conee = mysql.createConnection(config)
                conee.query(
                    "UPDATE agreement SET i_agree = ? WHERE agreement_id = ?",[tok.i_agree, agree.agreement_id],(err,result)=>{
                        if(err){
                            res.status(200).json({ status: false });
                        }else{
                            res.status(200).json({ status: "Договір погоджено" }); 
                        }                                                                             
                    }
                )
                conee.end()
            }else{
                res.status(200).json({ status: "Немає угоди" });
            }
        }else{
            res.status(200).json({ status: "Авторизуйтесь" });
        }
    }

    async deleteAgreement(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id)
            if(fl){
                let agree = await this.Service.getAgreement(tok.agreement_id, fl.flat_id, tok.user_id)
                if (agree){
                    const conee = mysql.createConnection(config)
                    conee.query('DELETE FROM agreement_act WHERE agreement_id = ?;', [agree.agreement_id])
                    conee.query('DELETE FROM agreement_filling WHERE agreement_id = ?;', [agree.agreement_id])
                    conee.query(
                        'DELETE FROM agreement WHERE agreement_id = ?;',[agree.agreement_id],(err,result)=>{
                            res.status(200).json({ status: true });
                        }
                    )
                    conee.end()
                }else{
                    res.status(200).json({ status: false });
                }
            }else{
                let admin = await this.appService.citizen(a.user_id, tok.flat_id)
                if(admin.acces_agreement === 1){
                    let agree = await this.Service.getAgreement(tok.agreement_id, admin.flat_id, tok.user_id)
                    if (agree){
                        const conee = mysql.createConnection(config)
                        conee.query('DELETE FROM agreement_act WHERE agreement_id = ?;', [agree.agreement_id])
                        conee.query('DELETE FROM agreement_filling WHERE agreement_id = ?;', [agree.agreement_id])
                        conee.query(
                            'DELETE FROM agreement WHERE agreement_id = ?;',[agree.agreement_id],(err,result)=>{
                                res.status(200).json({ status: true });
                            })
                        conee.end()
                    }else{
                        res.status(200).json({ status: false });
                    }
                }else{
                    res.status(200).json({ status: "Немає доступу" });
                }
            }
        }else{
            res.status(200).json({ status: "Авторизуйтесь" });
        }
    }

    async deleteYAgreement(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let agree = await this.Service.getAgreement(tok.agreement_id, tok.flat_id, a.user_id)
            if(agree){
                const conee = mysql.createConnection(config)
                conee.query('DELETE FROM agreement_act WHERE agreement_id = ?;', [agree.agreement_id])
                conee.query('DELETE FROM agreement_filling WHERE agreement_id = ?;', [agree.agreement_id])
                conee.query('DELETE FROM agreement WHERE agreement_id = ?;', [agree.agreement_id])
                conee.end()
                res.status(200).json({ status: true });
            }else{
                res.status(200).json([{ status: false }]);
            }
        }else{
            res.status(200).json([{ status: "Авторизуйтесь" }]);
        }
    }

// МБ видалити
    async getAgreement(tok: any, res: any): Promise<any> {
        //  Перевірити  
        let a = await this.appService.authentification(tok.auth)
        
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id)
            if(fl){
                let agreement = await this.Service.getUserAgreement(fl.flat_id, a.user_id, tok.offs)        
                res.status(200).json( agreement );
            }else{
                let admin = await this.appService.citizen(a.user_id, tok.flat_id)
                if(admin){
                    let agreement = await this.Service.getUserAgreement(admin.flat_id, a.user_id, tok.offs)
                    res.status(200).json( agreement );
                }else{
                    res.status(200).json([{ status: "Немає доступу" }]);
                }
            }
        }else{
            res.status(200).json([{ status: "Авторизуйтесь" }]);
        }
    }


    async getAgreements(tok: any, res: any): Promise<any> {
        //  Перевірити

        let a = await this.appService.authentification(tok.auth)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id)
            if(fl){
                let agreement = await this.Service.getAllAgreement(fl.flat_id, tok.offs)    
                res.status(200).json( agreement );
            }else{
                let admin = await this.appService.citizen(a.user_id, tok.flat_id)
                if(admin){
                    let agreement = await this.Service.getAllAgreement(admin.flat_id, tok.offs)
                    res.status(200).json( agreement );
                }else{
                    res.status(200).json([{ status: "Немає доступу" }]);
                }
            }
        }else{
            res.status(200).json([{ status: "Авторизуйтесь" }]);
        }
    }

    async getYAgreement(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let agreement = await this.Service.getUserAgreement(tok.flat_id, a.user_id, tok.offs) 
            res.status(200).json( agreement );
        }else{
            res.status(200).json([{ status: "Авторизуйтесь" }]);
        }
    }

    async getYAgreements(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let agreement = await this.Service.getAllYAgreement(a.user_id, tok.offs) 
            res.status(200).json( agreement );
        }else{
            res.status(200).json([{ status: "Авторизуйтесь" }]);
        }
    }


    async getSaveAgreements(tok: any, res: any): Promise<any> {
        //  Перевірити
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id)
            if(fl){
                let agreement = await this.Service.getAllSaveAgreement(fl.flat_id, tok.offs)    
                res.status(200).json( agreement );
            }else{
                let admin = await this.appService.citizen(a.user_id, tok.flat_id)
                if(admin){
                    let agreement = await this.Service.getAllSaveAgreement(admin.flat_id, tok.offs)
                    res.status(200).json( agreement );
                }else{
                    res.status(200).json([{ status: "Немає доступу" }]);
                }
            }
        }else{
            res.status(200).json([{ status: "Авторизуйтесь" }]);
        }
    }

    async getSaveYAgreements(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let agreement = await this.Service.getAllSaveYAgreement(a.user_id, tok.offs) 
            res.status(200).json( agreement );
        }else{
            res.status(200).json([{ status: "Авторизуйтесь" }]);
        }
    }

    async addAct(tok: object | any, res: any){
        //  Перевірити
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id)
            if(fl){
                if (await this.Service.addAct(tok, tok.agreement_id, fl.flat_id)){
                    res.status(200).json({ status: "Договір створено" });
                }else{
                    res.status(200).json({ status: "Данні введено не правильно" });
                }
            }else{
                let admin = await this.appService.citizen(a.user_id, tok.flat_id)
                if(admin){
                    if(await this.Service.addAct(tok, tok.agreement_id, admin.flat_id)){
                        res.status(200).json({ status: "Договір створено" });
                    }else{
                        res.status(200).json({ status: "Данні введено не правильно" });
                    }
                }else{
                    res.status(200).json({ status: "Немає доступу" });
                }
            }
        }else{
            res.status(200).json({ status: "Авторизуйтесь" });
        }
    }

    async getAct(tok: any, res: any): Promise<any> {
        //  Перевірити
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id)
            if(fl){
                let agreement = await this.Service.getAct(tok.agreement_id, fl.flat_id)    
                res.status(200).json( agreement );
            }else{
                let admin = await this.appService.citizen(a.user_id, tok.flat_id)
                if(admin){
                    let agreement = await this.Service.getAct(tok.agreement_id, admin.flat_id)
                    res.status(200).json( agreement );
                }else{
                    res.status(200).json([{ status: "Немає доступу" }]);
                }
            }
        }else{
            res.status(200).json([{ status: "Авторизуйтесь" }]);
        }
    }

    async getYAct(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let agreement = await this.Service.getAct(tok.agreement_id, a.user_id) 
            res.status(200).json( agreement );
        }else{
            res.status(200).json([{ status: "Авторизуйтесь" }]);
        }
    }


    async deleteAct(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id)
            if(fl){
                let agree = await this.Service.getAgreement(tok.agreement_id, fl.flat_id, tok.user_id)
                if (agree){
                    const conee = mysql.createConnection(config)
                    conee.query('DELETE FROM agreement_act WHERE agreement_id = ?;', [agree.agreement_id])
                    conee.query('DELETE FROM agreement_filling WHERE agreement_id = ?;', [agree.agreement_id])
                    conee.end()
                    res.status(200).json({ status: "Видалено" });
                }else{
                    res.status(200).json({ status: "Данні введено не правильно" });
                }
            }else{
                let admin = await this.appService.citizen(a.user_id, tok.flat_id)
                if(admin){
                    let agree = await this.Service.getAgreement(tok.agreement_id, admin.flat_id, tok.user_id)
                    if (agree){
                        const conee = mysql.createConnection(config)
                        conee.query('DELETE FROM agreement_act WHERE agreement_id = ?;', [agree.agreement_id])
                        conee.query('DELETE FROM agreement_filling WHERE agreement_id = ?;', [agree.agreement_id])
                        conee.end()
                        res.status(200).json({ status: "Видалено" });
                    }else{
                        res.status(200).json({ status: "Данні введено не правильно" });
                    }
                }else{
                    res.status(200).json({ status: "Немає доступу" });
                }
            }
        }else{
            res.status(200).json({ status: "Авторизуйтесь" });
        }
    }

}
