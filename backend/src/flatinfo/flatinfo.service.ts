/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { unlink } from 'fs';
import { Injectable } from '@nestjs/common';
import { RowDataPacket } from 'mysql2';
import * as mysql from 'mysql2';
import config from 'src/dbpar';
import { AppService } from 'src/app.service';
import { Service } from './service';
import conect2 from 'src/db_promise';



@Injectable()
export class FlatinfoService {
    constructor(private readonly appService: AppService, private readonly Service: Service) { }

    async getparametrsService(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id)
            if(fl){
                const conee = mysql.createConnection(config)
                try{
                    conee.query("UPDATE parametrs SET rooms = ?, repair_status = ?, area = ?, kitchen_area = ?, balcony = ?, floor = ?, option_flat = ?, metroname = ?, metrocolor = ?, floorless = ? WHERE flat_id = ?",
                    [tok.new.rooms, tok.new.repair_status, tok.new.area, tok.new.kitchen_area, tok.new.balcony, tok.new.floor, tok.new.option_flat, tok.new.metroname, tok.new.metrocolor, tok.new.floorless, fl.flat_id],
                    async (er, rrr) => {
                        if (er) {
                            res.status(200).json({ status: "Не правильно передані данні" })
                        } else {
                            let rentCheck = await this.Service.checkParamsForRent(tok.flat_id)
                            if(rentCheck == true){
                                res.status(200).json({ status: "Параметри успішно додані" });
                            }else{
                                res.status(200).json({ status: "Параметри успішно додані", rent: rentCheck });
                            }
                        }
                    })
                }catch(err){console.log(err)}finally{conee.end()}
            }else{
                res.status(200).json({ status: "Не співпало ID квартири з користувачем" });
            }
        }else{
            res.status(200).json({ status: "Не співпало ID квартири з користувачем" });
        }
    }

    async getflatinfoService(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id)
            if(fl){
                const conee = mysql.createConnection(config)
                try{
                    conee.query("UPDATE flat SET country = ?, region = ?, city = ?, street = ?,  houseNumber = ?, apartment = ?, flat_index = ?, distance_metro = ?, distance_stop = ?, distance_shop = ?, distance_green = ?, distance_parking = ?, district = ?, micro_district = ? WHERE flat_id = ?",
                    [tok.new.country, tok.new.region, tok.new.city, tok.new.street, tok.new.houseNumber, tok.new.apartment, tok.new.flat_index, tok.new.distance_metro, tok.new.distance_stop, tok.new.distance_shop, tok.new.distance_green, tok.new.distance_parking, tok.new.district, tok.new.micro_district, fl.flat_id],
                    async (err, resuuuu) => {
                        if (err) {
                            res.status(200).json({ status: "Не правильно передані данні" })
                        } else {
                            let rentCheck = await this.Service.checkParamsForRent(tok.flat_id)
                            if(rentCheck == true){
                                res.status(200).json({ status: "Параметри успішно додані" });
                            }else{
                                res.status(200).json({ status: "Параметри успішно додані", rent: rentCheck });
                            }
                        }
                    })
                }catch(err){console.log(err)}finally{conee.end()}
            }else{
                res.status(200).json({ status: "Не співпало ID квартири з користувачем" });
            }
        }else{
            res.status(200).json({ status: "Не співпало ID квартири з користувачем" });
        }
    }

    async getflataboutService(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id)
            if(fl){
                const conee = mysql.createConnection(config)
                try{
                    conee.query("UPDATE about SET  woman = ?, man = ?, family = ?, students = ?, animals = ?, bunker = ?, price_m = ?, price_d = ?, option_pay = ?, room = ?, private = ?, rent = ?, data = ?, about = ? WHERE flat_id = ?",
                    [tok.flat.woman, tok.flat.man, tok.flat.family, tok.flat.students, tok.flat.animals, tok.flat.bunker, tok.flat.price_m, tok.flat.price_d, tok.flat.option_pay, tok.flat.room, tok.flat.private, tok.flat.rent, new Date(), tok.flat.about, fl.flat_id],
                    async (er, rrrr) => {
                        if (er) {
                            res.status(200).json({ status: "Не правильно передані данні" })
                        } else {
                            let rentCheck = await this.Service.checkParamsForRent(tok.flat_id)
                            if(rentCheck == true){
                                res.status(200).json({ status: "Параметри успішно додані" });
                            }else{
                                res.status(200).json({ status: "Параметри успішно додані", rent: rentCheck });
                            }
                        }
                    })
                }catch(err){console.log(err)}finally{conee.end()}

                
            }else{
                const admin = await this.appService.citizen(a.user_id, tok.flat_id);
                if(admin.acces_flat_features === 1){
                    const conee = mysql.createConnection(config)
                    try{
                        conee.query("UPDATE about SET  woman = ?, man = ?, family = ?, students = ?, animals = ?, bunker = ?, price_m = ?, price_d = ?, option_pay = ?, room = ?, private = ?, rent = ?, about = ?, data = ? WHERE flat_id = ?",
                        [tok.flat.woman, tok.flat.man, tok.flat.family, tok.flat.students, tok.flat.animals, tok.flat.bunker, tok.flat.price_m, tok.flat.price_d, tok.flat.option_pay, tok.flat.room, tok.flat.private, tok.flat.rent, tok.flat.about, new Date(), admin.flat_id],
                        async (er, rrrr) => {
                            if (er) {
                                res.status(200).json({ status: "Не правильно передані данні" })
                            } else {
                                let rentCheck = await this.Service.checkParamsForRent(tok.flat_id)
                                if(rentCheck == true){
                                    res.status(200).json({ status: "Параметри успішно додані" });
                                }else{
                                    res.status(200).json({ status: "Параметри успішно додані", rent: rentCheck });
                                }
                            }
                        })
                    }catch(err){console.log(err)}finally{conee.end()}
                }else{
                    res.status(200).json({ status: "Не співпало ID квартири з користувачем" });
                }
            }
        }else{
            res.status(200).json({ status: "Не співпало ID квартири з користувачем" });
        }
    }

    async getFlatService(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id)
            if(fl){
                const conect = await conect2.getConnection();
                try{
                    let [rows1, fields1] = await conect.execute ('SELECT * FROM about WHERE flat_id = ?', [fl.flat_id])
                    let [rows2, fields2] = await conect.execute ('SELECT * FROM parametrs WHERE flat_id = ?', [fl.flat_id])
                    let [rows3, fields3] = await conect.execute ('SELECT * FROM flat_img WHERE flat_id = ?', [fl.flat_id])
                    let [rows4, fields4] = await conect.execute ('SELECT * FROM flat_status WHERE flat_id = ?;', [fl.flat_id])
                    if(Array.isArray(rows3)){
                        if (rows3[0] === undefined) {
                            res.status(200).json({ status: true, flat: fl, about: rows1[0], param: rows2[0], imgs: "Картинок нема", flatStat: rows4 });
                        } else {
                            res.status(200).json({ status: true, flat: fl, about: rows1[0], param: rows2[0], imgs: rows3, flatStat: rows4 });
                        }
                    }else{
                        res.status(200).json({ status: true, flat: fl, about: rows1[0], param: rows2[0], imgs: "Картинок нема" });
                    }
                }catch(err){console.log(err)}finally{conect.release();}

            }else{
                const admin = await this.appService.citizen(a.user_id, tok.flat_id);
                if(admin){
                    const conect = await conect2.getConnection();
                    try{
                        let [rows1, fields1] = await conect.execute ('SELECT apartment, city, street, country, houseNumber, flat_index, flat_id, flat_name, region, district, micro_district FROM flat WHERE flat_id = ?', [admin.flat_id])
                        let [rows2, fields2] = await conect.execute ('SELECT * FROM about WHERE flat_id = ?', [admin.flat_id])
                        let [rows3, fields3] = await conect.execute ('SELECT * FROM flat_img WHERE flat_id = ?', [admin.flat_id])
                        let [rows4, fields4] = await conect.execute ('SELECT * FROM parametrs WHERE flat_id = ?', [admin.flat_id])
                        let [rows5, fields5] = await conect.execute ('SELECT * FROM flat_status WHERE flat_id = ?;', [admin.flat_id])

                        if(Array.isArray(rows3)){
                            if (rows3[0] === undefined) {
                                res.status(200).json({ status: true, flat: rows1[0], about: rows2[0], param: rows4[0], imgs: "Картинок нема", acces: admin, flatStat: rows5 });
                            } else {
                                res.status(200).json({ status: true, flat: rows1[0], about: rows2[0], param: rows4[0], imgs: rows3, acces: admin, flatStat: rows5 });
                            }
                        }else{
                            res.status(200).json({ status: true, flat: rows1[0], about: rows2[0], param: rows4[0], imgs: "Картинок нема", acces: admin });
                        }
                    }catch(err){console.log(err)}finally{conect.release();}
                }else{
                    res.status(200).json({ status: "Не співпало ID квартири з користувачем" });
                }
            }
        }else{
            res.status(200).json({ status: "Не співпало ID квартири з користувачем" });
        }
    }


    async getflat_idService(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id,  tok.new.flat_id)
            if(fl === false){
                // data_create Додати в flat
                const conect = await conect2.getConnection();
                try{
                    let [rows1, fields1]:[any, any] = await conect.execute ('INSERT INTO flat (owner_id, flat_name, data_create) VALUES (?, ?, ?)', [a.user_id, tok.new.flat_id, new Date()])
                    await conect.query('INSERT INTO about (flat_id) VALUES (?)', [rows1.insertId]);
                    await conect.query('INSERT INTO parametrs (flat_id) VALUES (?)', [rows1.insertId]);
                    await conect.query('INSERT INTO flat_status (flat_id) VALUES (?)', [rows1.insertId]);
                    res.status(200).json({ status: "Нова оселя успішно створена" });
                }catch(err){
                    console.log(err)
                    res.status(200).json({ status: "Не правильно передані данні" })
                }finally{conect.release()}
            }else{
                res.status(200).json({ status: "Не співпало ID квартири з користувачем" });
            }
        }else{
            res.status(200).json({ status: "Не співпало ID квартири з користувачем" });
        }
    }


    async getflat_idsService(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok)
        if (a) {
            const conect = await conect2.getConnection();
            try{
                let [rows1, fields1]:[any, any] = await conect.execute ('SELECT flat_id, flat_name FROM flat WHERE owner_id = ?', [a.user_id])
                let [rows2, fields2] = await conect.query('SELECT flat_id, acces_added, acces_admin, acces_services, acces_comunal, acces_filling, acces_subs, acces_discuss, acces_agreement, acces_citizen, acces_comunal_indexes, acces_agent, acces_flat_features, acces_flat_chats FROM citizen WHERE user_id = ?', [a.user_id]);
                let flat_names = await this.Service.getFlatNames(rows2)
                res.status(200).json({ status: true, ids: rows1, citizen_ids: flat_names });
            }catch(err){
                console.log(err)
                res.status(200).json({ status: "Не правильно передані данні" })
            }finally{conect.release()}
        } else {
            res.status(200).json({ status: "Не вірний імейл або пароль" });
        }
    }


    async getdeleteflat(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id)
            if(fl){
                const conee = mysql.createConnection(config)
                try{
                    conee.query('SELECT * FROM flat_img WHERE flat_id = ?;', [fl.flat_id], (er, re: RowDataPacket[]) => {
                        re.forEach((i) => {
                            unlink("../../code/Static/flat/" + i.img, () => { null })
                        })
                    })
                    conee.query('SELECT * FROM filling WHERE flat_id = ?;', [fl.flat_id], (er, re: RowDataPacket[]) => {
                        re.forEach((i) => {
                            unlink("../../code/Static/filling/" + i.img, () => { null })
                        })
                    })
                    conee.query('SELECT * FROM comunal_img WHERE flat_id = ?;', [fl.flat_id], (er, re: RowDataPacket[]) => {
                        re.forEach((i) => {
                            unlink("../../code/Static/comunal/" + i.img, () => { null })
                        })
                    })
                    await this.Service.deleteFlat(fl.flat_id)
                    conee.query('DELETE FROM flat WHERE flat_id = ?', [fl.flat_id])
                    res.status(200).json({ status: "Будинок успішно видалено :(" });
                }catch(err){console.log(err)}finally{conee.end()}
            }else{
                res.status(200).json({ status: "Не співпало ID квартири з користувачем" });
            }
        }else{
            res.status(200).json({ status: "Будинок з таким ID вже існує" });
        }
    }

    async getFlatPublicInfo(tok: any, res: any): Promise<any> {
        const a = await this.appService.authentification(tok.auth);
        if(a){ 
            const conee = mysql.createConnection(config)
            try{
                conee.query('SELECT * FROM flat_img WHERE flat_id = ?', [tok.flat_id], (_err, img_results) => {
                    if (img_results[0] === undefined) {
                        res.status(200).json({ status: true, flat: tok.flat_id, imgs: "Картинок нема"});
                    } else {
                        res.status(200).json({ status: true, flat: tok.flat_id, imgs: img_results});
                    }
                })
            }catch(err){console.log(err)}finally{conee.end()}  
        }else{
          res.status(200).json({ status: false})
        }
    }


    async getFilling(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id)
            if(fl){
                const conee = mysql.createConnection(config)
                try{
                    conee.query('SELECT * FROM filling WHERE flat_id = ?', [tok.flat_id], (_err, results) => {
                        res.status(200).json({ status: results});
                    })
                }catch(err){console.log(err)}finally{conee.end()}  
            }else{
                const admin = await this.appService.citizen(a.user_id, tok.flat_id);
                if(admin){
                    const conee = mysql.createConnection(config)
                    try{
                        conee.query('SELECT * FROM filling WHERE flat_id = ?', [tok.flat_id], (_err, results) => {
                            res.status(200).json({ status: results});
                        })
                    }catch(err){console.log(err)}finally{conee.end()}  
                }else{
                    res.status(200).json({ status: "Не співпало ID квартири з користувачем" });
                }
            }
        }else{
            res.status(200).json({ status: "Не співпало ID квартири з користувачем" });
        }
    }

    async deleteFilling(tok: any, res: any) {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id)
            if(fl){
                const conect = await conect2.getConnection();
                try{
                    let [rows1, fields1]:[any, any] = await conect.execute('SELECT * FROM filling WHERE flat_id = ? AND filling_id = ?;', [fl.flat_id, tok.filling_id])
                    if(rows1[0] !== undefined){
                        await conect.execute('DELETE FROM filling WHERE flat_id = ? AND filling_id = ?', [rows1[0].flat_id, rows1[0].filling_id])
                        if(rows1[0].img){
                            unlink("../../code/Static/filling/" + rows1[0].img, (e)=>{
                                res.status(200).json({ status: "Видалення було успішне" });
                            })
                        }else{
                            res.status(200).json({ status: "Видалення було успішне" }); 
                        }
                    }else{
                        res.status(200).json({ status: false });
                    }
                }catch(err){
                    console.log(err)
                    res.status(200).json({ status: "Не правильно передані данні" })
                }finally{conect.release()}

            }else{
                const admin = await this.appService.citizen(a.user_id, tok.flat_id);
                if(admin.acces_filling === 1){
                    const conect = await conect2.getConnection();
                    try{
                        let [rows1, fields1]:[any, any] = await conect.execute('SELECT * FROM filling WHERE flat_id = ? AND filling_id = ?;', [admin.flat_id, tok.filling_id])
                        if(rows1[0] !== undefined){
                            await conect.execute('DELETE FROM filling WHERE flat_id = ? AND filling_id = ?', [rows1[0].flat_id, rows1[0].filling_id])
                            if(rows1[0].img){
                                unlink("../../code/Static/filling/" + rows1[0].img, (e)=>{
                                    res.status(200).json({ status: "Видалення було успішне" });
                                })
                            }else{
                                res.status(200).json({ status: "Видалення було успішне" }); 
                            }
                        }else{
                            res.status(200).json({ status: false });
                        }
                    }catch(err){
                        console.log(err)
                        res.status(200).json({ status: "Не правильно передані данні" })
                    }finally{conect.release()}         
                }else{
                    res.status(200).json({ status: "Не співпало ID квартири з користувачем" });
                }
            }
        }else{
            res.status(200).json({ status: "Не співпало ID квартири з користувачем" });
        }      
    }


    async getFlatinf(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id);
            if(fl){
                res.status(200).json(await this.Service.getFlatinf(fl.flat_id));
            }else{
                const admin = await this.appService.citizen(a.user_id, tok.flat_id);
                if(admin){
                    res.status(200).json(await this.Service.getFlatinf(admin.flat_id));
                }else{
                    res.status(200).json({ status: "Не співпало ID квартири з користувачем" });
                }                
            }
        }else{
            res.status(200).json({ status: "Не співпало ID квартири з користувачем" });
        }
    }

    async addFlatinf(tok: any, res: any): Promise<any> {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id);
            if(fl){
                res.status(200).json({ status: await this.Service.addFlatinf(tok.new, fl.flat_id)});
            }else{
                const admin = await this.appService.citizen(a.user_id, tok.flat_id);
                if(admin.acces_flat_features === 1){
                    res.status(200).json({ status: await this.Service.addFlatinf(tok.new, admin.flat_id)});
                }else{
                    res.status(200).json({ status: "Не співпало ID квартири з користувачем" });
                }                
            }
        }else{
            res.status(200).json({ status: "Не співпало ID квартири з користувачем" });
        }
    }


    async deleteFlatImg(tok: any, res: any) {
        let a = await this.appService.authentification(tok.auth)
        if(a){
            let fl = await this.appService.flatCheck(a.user_id, tok.flat_id);
            if(fl){
                const conect = await conect2.getConnection();
                try{
                    let [rows1, fields1]:[any, any] = await conect.execute('SELECT * FROM flat_img WHERE flat_id = ? AND img = ?;', [fl.flat_id, tok.img])
                    if(rows1[0] !== undefined){
                        await conect.execute('DELETE FROM flat_img WHERE flat_id = ? AND img = ?', [rows1[0].flat_id, rows1[0].img])
                        if(rows1[0].img){
                            unlink("../../code/Static/flat/" + rows1[0].img, async (e)=>{
                                let rentCheck = await this.Service.checkParamsForRent(tok.flat_id)
                                if(rentCheck == true){
                                    res.status(200).json({ status: "Параметри успішно додані" });
                                }else{
                                    res.status(200).json({ status: "Видалення було успішне", rent: rentCheck });
                                }
                            })
                        }else{
                            res.status(200).json({ status: "Видалення було успішне" }); 
                        }
                    }else{
                        res.status(200).json({ status: false });
                    }
                }catch(err){
                    console.log(err)
                    res.status(200).json({ status: "Не правильно передані данні" })
                }finally{conect.release()}             
            }else{
                const admin = await this.appService.citizen(a.user_id, tok.flat_id);
                if(admin.acces_flat_features === 1){
                    const conect = await conect2.getConnection();
                    try{
                        let [rows1, fields1]:[any, any] = await conect.execute('SELECT * FROM flat_img WHERE flat_id = ? AND img = ?;', [admin.flat_id, tok.img])
                        if(rows1[0] !== undefined){
                            await conect.execute('DELETE FROM flat_img WHERE flat_id = ? AND img = ?', [rows1[0].flat_id, rows1[0].img])
                            if(rows1[0].img){
                                unlink("../../code/Static/flat/" + rows1[0].img, (e)=>{
                                    res.status(200).json({ status: "Видалення було успішне" });
                                })
                            }else{
                                res.status(200).json({ status: "Видалення було успішне" }); 
                            }
                        }else{
                            res.status(200).json({ status: false });
                        }
                    }catch(err){
                        console.log(err)
                        res.status(200).json({ status: "Не правильно передані данні" })
                    }finally{conect.release()} 
                }else{
                    res.status(200).json({ status: "Не співпало ID квартири з користувачем" });
                }                
            }
        }else{
            res.status(200).json({ status: "Не співпало ID квартири з користувачем" });
        }      
    }


}
