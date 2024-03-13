/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2';
import config from 'src/dbpar';
import { rename, unlink, readFile } from 'fs';
import { RowDataPacket } from 'mysql2';
import { AppService } from 'src/app.service';
import * as sharp from 'sharp';
import { Service } from './service';



@Injectable()
export class ImgService {
    constructor(private readonly appService: AppService, private readonly Service: Service) {}

    async saveImgF(files: any, inf: any, res: any) {
        const i = JSON.parse(inf.auth)
        let a = await this.appService.authentification(i)
        let fl = await this.appService.flatCheck(a.user_id, inf.flat_id)
        if (a && fl && files) {
            const randomNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
            const type_file = '.' + files.mimetype.split('/')[1]
            if(type_file == '.jpg' || type_file == '.png' || type_file == '.img' || type_file == '.jpeg' || type_file == '.webp'){
                const conee = mysql.createConnection(config)
                try{
                    conee.query("INSERT INTO flat_img (flat_id, img) VALUES (?, ?)", [inf.flat_id, files.filename + randomNumber + type_file], (err, resuuuu) => {
                        
                        if (err) {
                            unlink("../../code/Static/" + files.filename, () => {
                                res.status(200).json({ status: "Помилка збереження" });
                            })
                        } else {
                            const conee = mysql.createConnection(config)
                            conee.query('SELECT * FROM flat_img WHERE flat_id = ?;', [inf.flat_id], (er, re: RowDataPacket[]) => {
                                conee.end()
                                if (re.length >= 20) {
                                    conee.query('DELETE FROM flat_img WHERE img = ?', [re[0].img])
                                    unlink("../../code/Static/flat/" + re[0].img, () => { })
                                }
                                rename("../../code/Static/" + files.filename, "../../code/Static/" + files.filename + type_file, (err) => {
                                    const inputFile = "../../code/Static/" + files.filename + type_file;
                                    const outputFile = "../../code/Static/flat/" + files.filename + randomNumber + type_file;
                                    readFile(inputFile, (errrrrr, data) => {
                                        if (errrrrr) {
                                            console.error(err);
                                            return;
                                        }
                                        sharp(data)
                                            .metadata()
                                            .then((metadata) => {
                                                let width: number
                                                let height: number
                                                if (metadata.width >= metadata.height) {
                                                    height = 600;// нова висота
                                                    width = Math.floor((height * metadata.width) / metadata.height);// нова ширина
                                                } else if(metadata.width <= metadata.height) {
                                                    height = 850;// нова висота
                                                    width = Math.floor((height * metadata.width) / metadata.height);// нова ширина
                                                }
                                                sharp(inputFile).resize(width, height)
                                                    .toFile(outputFile)
                                                    .then(() => {
                                                        if (err) {
                                                            unlink(inputFile, () => { 1 })
                                                            unlink(outputFile, () => { 1 })
                                                            res.status(200).json({ status: "Помилка збереження" });
                                                        } else {
                                                            unlink(inputFile, () => { 1 })
                                                            res.status(200).json({ status: "Збережено" });
                                                        }
                                                    })
                                                    .catch((err) => {
                                                        unlink("../../code/Static/" + files.filename + type_file, () => { 1 })
                                                        // console.error('Помилка при зміні розміру зображення:', err);
                                                    });
                                            })
                                            .catch((error) => {
                                                console.error(error);
                                            });
                                    });
                                })
                            })
                            res.status(200).json({ status: "Збережено" });
                        }
                    })
                }catch(err){}finally{conee.end()}

            }else{
                unlink("../../code/Static/" + files.filename, () => {
                    res.status(200).json({ status: "Помилковий формат" });
                })
            }
        } else {
            unlink("../../code/Static/" + files.filename, () => {
                res.status(200).json({ status: "Авторизуйтесь" });
            })
        }
    }




    async sa(files: any, inf: any, res: any) {
        // const i = JSON.parse(inf.auth!)
        const type_file = '.' + files.mimetype.split('/')[1]
        rename("../../code/Static/" + files.filename, "../../code/Static/flat/" + files.filename + type_file, (err) => { })
        res.status(200).json({ status: "Фото квартири успішно збережене" });
    }


    async saveImgU(files: any, inf: any, res: any) {
        const i = JSON.parse(inf.auth)
        let a = await this.appService.authentification(i)
        if (a && files) {
            const type_file = '.' + files.mimetype.split('/')[1]
            if(type_file == '.jpg' || type_file == '.png' || type_file == '.img' || type_file == '.jpeg' || type_file == '.webp'){
                const randomNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
                const conee = mysql.createConnection(config)
                try{
                    conee.query('SELECT * FROM user_img WHERE user_id = ?;', [a.user_id], (er, re:any) => {
                        const conee = mysql.createConnection(config)
                        try{if (re[0].img != "user_default.svg") {
                            conee.query('DELETE FROM user_img WHERE user_id = ?', [a.user_id])
                            unlink("../../code/Static/users/" + re[0].img, (e) => { console.log(e) })
                        }else if(re[0].img == "user_default.svg"){
                            conee.query('DELETE FROM user_img WHERE user_id = ?', [a.user_id])
                        }}catch(err){}finally{conee.end()}
    
                        try{
                            rename("../../code/Static/" + files.filename, "../../code/Static/" + files.filename + type_file, (err) => {
                                const inputFile = "../../code/Static/" + files.filename + type_file;
                                const outputFile = "../../code/Static/users/" + files.filename + randomNumber + type_file;
                                readFile(inputFile, (err, data) => {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }
                                    sharp(data)
                                        .metadata()
                                        .then((metadata) => {
                                            let width: number
                                            let height: number
                                            if (metadata.width >= metadata.height) {
                                                height = 600;// нова висота
                                                width = Math.floor((height * metadata.width) / metadata.height);// нова ширина
                                            } else if(metadata.width <= metadata.height) {
                                                height = 850;// нова висота
                                                width = Math.floor((height * metadata.width) / metadata.height);// нова ширина
                                            }
                                            sharp(inputFile).resize(width, height)
                                                .toFile(outputFile)
                                                .then(() => {
                                                    const conee = mysql.createConnection(config)
                                                    conee.query("INSERT INTO user_img (user_id, img) VALUES (?, ?)", [a.user_id, files.filename + randomNumber + type_file],
                                                        (errrr) => {
                                                            conee.end()
                                                            if (errrr) {
                                                                unlink(inputFile, () => { })
                                                                unlink(outputFile, () => { })
                                                                res.status(200).json({ status: "Помилка збереження" });
                                                            } else {
                                                                unlink(inputFile, () => { })
                                                                res.status(200).json({ status: "Збережено" });
                                                            }
                                                        })
                                                })
                                                .catch((err) => {
                                                    unlink("../../code/Static/" + files.filename + type_file, () => { })
                                                    console.error('Помилка при зміні розміру зображення:', err);
                                                });
                                        })
                                        .catch((error) => {
                                            console.error(error);
                                        });
                                })
                            })
                        }catch(errrr){
                            console.error(errrr);
                        }   
                    })
                }catch(err){}finally{conee.end()}
  
            }else{
                unlink("../../code/Static/" + files.filename, () => {
                    res.status(200).json({ status: "Помилковий формат" });
                })
            }
        } else {
            unlink("../../code/Static/" + files.filename, () => {
                res.status(200).json({ status: "Авторизуйтесь" });
            })
        }
    }



    async saveImgFilling(files: any, inf: any, res: any) {   
        const i = JSON.parse(inf.auth)
        let b = JSON.parse(inf.inf)
        let a = await this.appService.authentification(i)
        if(a){
            const randomNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
            let fl = await this.appService.flatCheck(a.user_id, b.flat_id)
            if(fl){
                if(files){
                    const type_file = '.' + files.mimetype.split('/')[1]
                    if(type_file == '.jpg' || type_file == '.png' || type_file == '.img' || type_file == '.jpeg' || type_file == '.webp'){
                        rename("../../code/Static/" + files.filename, "../../code/Static/" + files.filename + type_file, (err) => {
                            const inputFile = "../../code/Static/" + files.filename + type_file;
                            const outputFile = "../../code/Static/filling/" + files.filename + randomNumber + type_file;
                            readFile(inputFile, (err, data) => {
                                if (err) {
                                    console.error(err);
                                    return;
                                }
                                sharp(data)
                                    .metadata()
                                    .then((metadata) => {
                                        let width: number
                                        let height: number
                                        if (metadata.width >= metadata.height) {
                                            height = 400;// нова висота
                                            width = Math.floor((height * metadata.width) / metadata.height);// нова ширина
                                        } else if(metadata.width <= metadata.height) {
                                            height = 600;// нова висота
                                            width = Math.floor((height * metadata.width) / metadata.height);// нова ширина
                                        }
                                        sharp(inputFile).resize(width, height)
                                            .toFile(outputFile)
                                            .then(() => {
                                                const conee = mysql.createConnection(config)
                                                try{
                                                    conee.query("INSERT INTO filling (flat_id, img, about_filling, name_filling, type_filling, number_filling, condition_filling) VALUES (?, ?, ?, ?, ?, ?, ?)", [b.flat_id, files.filename + randomNumber + type_file, b.about_filling, b.name_filling, b.type_filling, b.number_filling, b.condition_filling],
                                                    (errrr) => {
                                                        if (errrr) {
                                                            unlink(inputFile, () => { })
                                                            unlink(outputFile, () => { })
                                                            res.status(200).json({ status: "Помилка збереження" });
                                                        } else {
                                                            unlink(inputFile, () => { })
                                                            res.status(200).json({ status: "Збережено" });
                                                        }
                                                    })
                                                }catch(err){}finally{conee.end()}
                                            })
                                            .catch((err) => {
                                                unlink("../../code/Static/" + files.filename + type_file, () => { })
                                                console.error('Помилка при зміні розміру зображення:', err);
                                            });
                                    })
                                    .catch((error) => {
                                        console.error(error);
                                    });
                            })
                        })
                    }else{
                        try {
                            unlink("../../code/Static/" + files.filename, () => {
                                res.status(200).json({ status: "Помилковий формат" });
                            })
                        } catch (err) {
                            throw err
                        }
                    }
                }else{
                    const conee = mysql.createConnection(config)
                    try{
                        conee.query("INSERT INTO filling (flat_id, about_filling, name_filling, type_filling, number_filling, condition_filling) VALUES (?, ?, ?, ?, ?, ?)", [b.flat_id, b.about_filling, b.name_filling, b.type_filling, b.number_filling, b.condition_filling],
                        (errr) => {
                            if (errr) {
                                res.status(200).json({ status: "Помилка збереження" });
                            } else {
                                res.status(200).json({ status: "Збережено" });
                            }
                        })
                    }catch(err){}finally{conee.end()}  
                }
            }else{
                let admin = await this.appService.citizen(a.user_id, b.flat_id)
                if(admin.acces_filling){
                    if(files){
                        const type_file = '.' + files.mimetype.split('/')[1]
                        if(type_file == '.jpg' || type_file == '.png' || type_file == '.img' || type_file == '.jpeg' || type_file == '.webp'){
                            rename("../../code/Static/" + files.filename, "../../code/Static/" + files.filename + type_file, (err) => {
                                const inputFile = "../../code/Static/" + files.filename + type_file;
                                const outputFile = "../../code/Static/filling/" + files.filename + randomNumber + type_file;
                                readFile(inputFile, (err, data) => {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }
                                    sharp(data)
                                        .metadata()
                                        .then((metadata) => {
                                            let width: number
                                            let height: number
                                            if (metadata.width >= metadata.height) {
                                                height = 400;// нова висота
                                                width = Math.floor((height * metadata.width) / metadata.height);// нова ширина
                                            } else if(metadata.width <= metadata.height) {
                                                height = 600;// нова висота
                                                width = Math.floor((height * metadata.width) / metadata.height);// нова ширина
                                            }
                                            sharp(inputFile).resize(width, height)
                                                .toFile(outputFile)
                                                .then(() => {
                                                    const conee = mysql.createConnection(config)
                                                    try{
                                                        conee.query("INSERT INTO filling (flat_id, img, about_filling, name_filling, type_filling, number_filling, condition_filling) VALUES (?, ?, ?, ?, ?, ?, ?)", [b.flat_id, files.filename + randomNumber + type_file, b.about_filling, b.name_filling, b.type_filling, b.number_filling, b.condition_filling],
                                                        (errrr) => {
                                                            if (errrr) {
                                                                unlink(inputFile, () => { })
                                                                unlink(outputFile, () => { })
                                                                res.status(200).json({ status: "Помилка збереження" });
                                                            } else {
                                                                unlink(inputFile, () => { })
                                                                res.status(200).json({ status: "Збережено" });
                                                            }
                                                        })
                                                    }catch(err){}finally{conee.end()}    
                                                })
                                                .catch((err) => {
                                                    unlink("../../code/Static/" + files.filename + type_file, () => { })
                                                    console.error('Помилка при зміні розміру зображення:', err);
                                                });
                                        })
                                        .catch((error) => {
                                            console.error(error);
                                        });
                                })
                            })
                        }else{
                            try {
                                unlink("../../code/Static/" + files.filename, () => {
                                    res.status(200).json({ status: "Помилковий формат" });
                                })
                            } catch (err) {
                                throw err
                            }
                        }
                    }else{
                        const conee = mysql.createConnection(config)
                        try{
                            conee.query("INSERT INTO filling (flat_id, about_filling, name_filling, type_filling, number_filling, condition_filling) VALUES (?, ?, ?, ?, ?, ?)", [b.flat_id, b.about_filling, b.name_filling, b.type_filling, b.number_filling, b.condition_filling],
                            (errr) => {
                                if (errr) {
                                    res.status(200).json({ status: "Помилка збереження" });
                                } else {
                                    res.status(200).json({ status: "Збережено" });
                                }
                            })
                        }catch(err){}finally{conee.end()} 
                    }
                }else{
                    try {
                        unlink("../../code/Static/" + files.filename, () => {
                            res.status(200).json({ status: "Немає доступу" });
                        })
                    } catch (err) {
                        throw err
                    }
                }
            }
        }else{
            try {
                unlink("../../code/Static/" + files.filename, () => {
                    res.status(200).json({ status: "Авторизуйтесь" });
                })
            } catch (err) {
                throw err
            }
        }
    }
    
    
    async saveImgComunal(files: any, inf: any, res: any) {
        const i = JSON.parse(inf.auth)
        let b = JSON.parse(inf.inf)
        let a = await this.appService.authentification(i)
        if(a){
            const randomNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
            let fl = await this.appService.flatCheck(a.user_id, b.flat_id)
            if(fl){
                if(files){
                    const type_file = '.' + files.mimetype.split('/')[1]
                    if(type_file == '.jpg' || type_file == '.png' || type_file == '.img' || type_file == '.jpeg' || type_file == '.webp'){
                        let sssss = await this.Service.getComunalMo(b.flat_id, b.comunal_name,b.when_pay_y, b.when_pay_m)
                        if(sssss[0]){
                            const conee = mysql.createConnection(config)
                            try{
                                conee.query('DELETE FROM comunal_img WHERE flat_id = ? AND comunal_name = ? AND when_pay_y = ? AND when_pay_m = ?', [sssss[0].flat_id, sssss[0].comunal_name, String(sssss[0].when_pay_y), sssss[0].when_pay_m])
                                unlink("../../code/Static/comunal/" + sssss[0].img, (e) => { console.log(e) })
                            }catch(err){}finally{conee.end()}

                        }

                        rename("../../code/Static/" + files.filename, "../../code/Static/" + files.filename + type_file, (err) => {
                            const inputFile = "../../code/Static/" + files.filename + type_file;
                            const outputFile = "../../code/Static/comunal/" + files.filename + randomNumber + type_file;
                            readFile(inputFile, (err, data) => {
                                if (err) {
                                    console.error(err);
                                    return;
                                }
                                sharp(data)
                                    .metadata()
                                    .then((metadata) => {
                                        let width: number
                                        let height: number
                                        if (metadata.width >= metadata.height) {
                                            height = 600;// нова висота
                                            width = Math.floor((height * metadata.width) / metadata.height);// нова ширина
                                        } else if(metadata.width <= metadata.height) {
                                            height = 900;// нова висота
                                            width = Math.floor((height * metadata.width) / metadata.height);// нова ширина
                                        }
                                        sharp(inputFile).resize(width, height)
                                            .toFile(outputFile)
                                            .then(async () => {
                                                try{
                                                    await this.Service.addComunal(b, a.user_id, files.filename + randomNumber + type_file)
                                                    unlink(inputFile, () => { 1})
                                                    res.status(200).json({ status: "Збережено" });
                                                }catch(err){
                                                    unlink(inputFile, () => { })
                                                    unlink(outputFile, () => { })
                                                    res.status(200).json({ status: "Помилка збереження" });
                                                }
                                            })
                                            .catch((err) => {
                                                unlink("../../code/Static/" + files.filename + type_file, () => { })
                                                console.error('Помилка при зміні розміру зображення:', err);
                                            });
                                    })
                                    .catch((error) => {
                                        console.error(error);
                                    });
                            })
                        })
                    }else{
                        try {
                            unlink("../../code/Static/" + files.filename, () => {
                                res.status(200).json({ status: "Помилковий формат" });
                            })
                        } catch (err) {
                            throw err
                        }
                    }
                }else{
                    res.status(200).json({ status: "Файл відсутній" });
                }
            }else{
                let admin = await this.appService.citizen(a.user_id, b.flat_id)
                if(admin.acces_comunal === 1){
                    if(files){
                        const type_file = '.' + files.mimetype.split('/')[1]
                        if(type_file == '.jpg' || type_file == '.png' || type_file == '.img' || type_file == '.jpeg' || type_file == '.webp'){
                            let sssss = await this.Service.getComunalMo(b.flat_id, b.comunal_name,b.when_pay_y, b.when_pay_m)
                            if(sssss[0]){
                                const conee = mysql.createConnection(config)
                                try{
                                    conee.query('DELETE FROM comunal_img WHERE flat_id = ? AND comunal_name = ? AND when_pay_y = ? AND when_pay_m = ?', [sssss[0].flat_id, sssss[0].comunal_name, String(sssss[0].when_pay_y), sssss[0].when_pay_m])
                                    unlink("../../code/Static/comunal/" + sssss[0].img, (e) => { console.log(e) })
                                }catch(err){}finally{conee.end()}

                            }
                            rename("../../code/Static/" + files.filename, "../../code/Static/" + files.filename + type_file, (err) => {
                                const inputFile = "../../code/Static/" + files.filename + type_file;
                                const outputFile = "../../code/Static/comunal/" + files.filename + randomNumber + type_file;
                                readFile(inputFile, (err, data) => {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }
                                    sharp(data)
                                        .metadata()
                                        .then((metadata) => {
                                            let width: number
                                            let height: number
                                            if (metadata.width >= metadata.height) {
                                                height = 600;// нова висота
                                                width = Math.floor((height * metadata.width) / metadata.height);// нова ширина
                                            } else if(metadata.width <= metadata.height) {
                                                height = 900;// нова висота
                                                width = Math.floor((height * metadata.width) / metadata.height);// нова ширина
                                            }
                                            sharp(inputFile).resize(width, height)
                                                .toFile(outputFile)
                                                .then(async () => {
                                                    try{
                                                        await this.Service.addComunal(b, a.user_id, files.filename + randomNumber + type_file)
                                                        unlink(inputFile, () => { })
                                                        res.status(200).json({ status: "Збережено" });
                                                    }catch(err){
                                                        unlink(inputFile, () => { })
                                                        unlink(outputFile, () => { })
                                                        res.status(200).json({ status: "Помилка збереження" });
                                                    }
                                                })
                                                .catch((err) => {
                                                    unlink("../../code/Static/" + files.filename + type_file, () => { })
                                                    console.error('Помилка при зміні розміру зображення:', err);
                                                });
                                        })
                                        .catch((error) => {
                                            console.error(error);
                                        });
                                })
                            })
                        }else{
                            try {
                                unlink("../../code/Static/" + files.filename, () => {
                                    res.status(200).json({ status: "Помилковий формат" });
                                })
                            } catch (err) {
                                throw err
                            }
                        }
                    }else{
                        res.status(200).json({ status: "Файл відсутній" });
                    }
                }else{
                    try {
                        unlink("../../code/Static/" + files.filename, () => {
                            res.status(200).json({ status: "Немає доступу" });
                        })
                    } catch (err) {
                        throw err
                    }
                }
            }
        }else{
            try {
                unlink("../../code/Static/" + files.filename, () => {
                    res.status(200).json({ status: "Авторизуйтесь" });
                })
            } catch (err) {
                throw err
            }
        }
    } 
}