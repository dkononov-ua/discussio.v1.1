/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2';
import config from 'src/dbpar';
import { AppService } from 'src/app.service';


@Injectable()
export class AddService {
    constructor(private readonly appService: AppService) {}

    async getUserinfoServiceAdd(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            const conee = mysql.createConnection(config)
            try{
                console.log(tok)
                conee.query("UPDATE users SET firstName = ?, lastName = ?, surName = ?, dob = ? WHERE user_id = ?",
                [tok.new.firstName, tok.new.lastName, tok.new.surName, new Date(tok.new.dob), a.user_id],
                (err, resuuuu)=>{
                    if (err) {  
                        res.status(200).json({ status: "Не правильно передані данні" })
                    }else{
                        res.status(200).json({ status: true, inf:a });                            
                    }
                })
            }catch(err){
                console.log(err)
                res.status(200).json({ status: false });
            }finally{conee.end()}  
        }else{
            res.status(200).json({ status: false });
        }
    }

    
    async getUsercontactsServiceAdd(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            const conee = mysql.createConnection(config)
            try{
                conee.query("UPDATE contacts SET instagram = ?, telegram = ?, viber = ?, facebook = ?, tell = ?, phone_alt = ?, mail = ? WHERE user_id = ?",
                [tok.new.instagram, tok.new.telegram, tok.new.viber, tok.new.facebook, tok.new.tell, tok.new.phone_alt, tok.new.mail, a.user_id],
                (err, resuuuu)=>{
                    if (err) {  
                        res.status(200).json({ status: "Не правильно передані данні" })
                    }else{
                        res.status(200).json({ status: true});                            
                    }
                })
            }catch(err){
                console.log(err)
                res.status(200).json({ status: false});
            }finally{conee.end()}
        }else{
            res.status(200).json({ status: false });
        }
    }

    async addUserParams(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            const conee = mysql.createConnection(config)
            try{
                conee.query("UPDATE user_parametrs SET add_in_flat = ? WHERE user_id = ?",
                [tok.add_in_flat, a.user_id],
                (err, resuuuu)=>{
                    if (err) {  
                        res.status(200).json({ status: "Не правильно передані данні" })
                    }else{
                        res.status(200).json({ status: true});                            
                    }
                })
            }catch(err){
                console.log(err)
                res.status(200).json({ status: false});
            }finally{
                conee.end()
            }
        }else{
            res.status(200).json({ status: false });
        }
    }

}
